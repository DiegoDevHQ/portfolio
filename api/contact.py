"""Portfolio contact form -> email, via the Resend API.

Setup (one time, in the Vercel dashboard -> Project -> Settings -> Environment Variables):
    RESEND_API_KEY      required. Create a free key at https://resend.com.
    CONTACT_TO_EMAIL    optional. Where messages go. Defaults to the address on the site.
    CONTACT_FROM_EMAIL  optional. Defaults to Resend's shared test sender, which can only
                        deliver to the email address you signed up to Resend with.

Until RESEND_API_KEY is set this returns 503, and the page falls back to showing the
email address. Uses only the standard library, so requirements.txt stays empty.
"""

import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler

DEFAULT_TO = "diegoaogc@gmail.com"
DEFAULT_FROM = "Portfolio contact form <onboarding@resend.dev>"
MAX_BODY_BYTES = 20_000
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

# Best-effort flood guard. Serverless instances are short-lived, so this only
# slows down a burst hitting one warm instance; it is not a real rate limit.
_recent = {}
WINDOW_S = 600
MAX_PER_WINDOW = 5


def _too_many(ip):
    now = time.time()
    hits = [t for t in _recent.get(ip, []) if now - t < WINDOW_S]
    hits.append(now)
    _recent[ip] = hits
    return len(hits) > MAX_PER_WINDOW


def _clean(value, limit):
    return str(value or "").strip()[:limit]


def _validate(data):
    name = _clean(data.get("name"), 100)
    email = _clean(data.get("email"), 200)
    message = _clean(data.get("message"), 5000)
    if not name or not message:
        return None, "Please add your name and a message."
    if not EMAIL_RE.match(email) or "\n" in email or "\r" in email:
        return None, "Please enter a valid email so I can reply."
    return {"name": name.replace("\n", " ").replace("\r", " "), "email": email, "message": message}, None


def _send_email(api_key, msg):
    to_addr = os.environ.get("CONTACT_TO_EMAIL", DEFAULT_TO)
    from_addr = os.environ.get("CONTACT_FROM_EMAIL", DEFAULT_FROM)
    text = f"{msg['message']}\n\n— {msg['name']} <{msg['email']}>\nSent from the portfolio contact form."
    body_html = (
        f"<p>{html.escape(msg['message']).replace(chr(10), '<br>')}</p>"
        f"<p>— {html.escape(msg['name'])} &lt;{html.escape(msg['email'])}&gt;</p>"
        "<p style='color:#888'>Sent from the portfolio contact form.</p>"
    )
    payload = {
        "from": from_addr,
        "to": [to_addr],
        "reply_to": msg["email"],
        "subject": f"Portfolio message from {msg['name']}",
        "text": text,
        "html": body_html,
    }
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            # Resend's firewall rejects urllib's default "Python-urllib/3.x"
            # user agent with Cloudflare error 1010, so name ourselves.
            "User-Agent": "diegodevhq-portfolio-contact/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return 200 <= resp.status < 300
    except urllib.error.HTTPError as e:
        # Shows up in the Vercel function logs; never includes the API key.
        print(f"Resend rejected the email: {e.code} {e.read()[:300]!r}", file=sys.stderr)
        return False


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        self._send_json(405, {"error": "Use POST."})

    def do_POST(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > MAX_BODY_BYTES:
            self._send_json(400, {"error": "That message is too long. Please shorten it."})
            return
        try:
            data = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(data, dict):
                raise ValueError
        except (ValueError, UnicodeDecodeError):
            self._send_json(400, {"error": "The form data couldn't be read. Please try again."})
            return

        # Honeypot: people never see this field, so anything in it is a bot.
        # Pretend it worked so the bot doesn't learn to skip it.
        if _clean(data.get("company"), 200):
            self._send_json(200, {"ok": True})
            return

        msg, problem = _validate(data)
        if problem:
            self._send_json(400, {"error": problem})
            return

        ip = (self.headers.get("x-forwarded-for") or self.client_address[0] or "").split(",")[0].strip()
        if _too_many(ip):
            self._send_json(429, {"error": "Too many messages at once. Please wait a few minutes."})
            return

        api_key = os.environ.get("RESEND_API_KEY", "").strip()
        if not api_key:
            self._send_json(503, {"error": "not_configured"})
            return

        try:
            sent = _send_email(api_key, msg)
        except (urllib.error.URLError, TimeoutError):
            sent = False
        if not sent:
            self._send_json(502, {"error": "send_failed"})
            return
        self._send_json(200, {"ok": True})
