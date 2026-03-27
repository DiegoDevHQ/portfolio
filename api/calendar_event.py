from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse


def _escape_ics_value(text):
    return str(text or "").replace("\\", "\\\\").replace("\n", "\\n").replace(",", "\\,").replace(";", "\\;")


def _sanitize_filename(text):
    safe = "".join(ch if ch.isalnum() or ch in "-_" else "-" for ch in str(text or "task"))
    safe = safe.strip("-")[:40] or "task"
    return f"{safe}.ics"


def _to_ics_date(value):
    cleaned = str(value or "").strip()
    if not cleaned:
        return ""
    return cleaned.replace("-", "").replace(":", "").replace(".000", "")


def _build_ics(title, details, start, end, uid_value):
    return "\r\n".join(
        [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Task Planner 2.0//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            f"UID:{_escape_ics_value(uid_value)}",
            f"DTSTAMP:{_to_ics_date(start)}",
            f"DTSTART:{_to_ics_date(start)}",
            f"DTEND:{_to_ics_date(end)}",
            f"SUMMARY:{_escape_ics_value(title)}",
            f"DESCRIPTION:{_escape_ics_value(details)}",
            "END:VEVENT",
            "END:VCALENDAR",
        ]
    )


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        import json

        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        query = parse_qs(parsed.query)

        title = query.get("title", ["Task"])[0]
        details = query.get("details", [""])[0]
        start = query.get("start", [""])[0]
        end = query.get("end", [""])[0]
        uid_value = query.get("uid", [title])[0]
        filename = _sanitize_filename(query.get("filename", [title])[0])

        if not start or not end:
            self._send_json(400, {"error": "Missing calendar start/end values."})
            return

        body = _build_ics(title, details, start, end, uid_value).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/calendar; charset=utf-8")
        self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)