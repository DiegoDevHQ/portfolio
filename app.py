"""Dependency-free Vercel entrypoint serving static pages and churn APIs."""

import json
import math
from http.server import BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent

FEATURES = [
    "Age",
    "Tenure_Months",
    "Monthly_Charges",
    "Total_Charges",
    "Contract_Type",
    "Internet_Service",
    "Online_Security",
    "Online_Backup",
    "Device_Protection",
    "Tech_Support",
    "Streaming_TV",
    "Streaming_Movies",
    "Paperless_Billing",
    "Payment_Method",
]

CATEGORICAL_OPTIONS = {
    "Contract_Type": ["Month-to-month", "One year", "Two year"],
    "Internet_Service": ["DSL", "Fiber optic", "No"],
    "Online_Security": ["No", "No internet", "Yes"],
    "Online_Backup": ["No", "No internet", "Yes"],
    "Device_Protection": ["No", "No internet", "Yes"],
    "Tech_Support": ["No", "No internet", "Yes"],
    "Streaming_TV": ["No", "No internet", "Yes"],
    "Streaming_Movies": ["No", "No internet", "Yes"],
    "Paperless_Billing": ["No", "Yes"],
    "Payment_Method": ["Bank transfer", "Credit card", "Electronic check", "Mailed check"],
}


def _as_float(payload, key):
    try:
        return float(payload.get(key, 0))
    except Exception:
        return 0.0


def _heuristic_churn_probability(payload):
    risk = 0.15

    tenure = _as_float(payload, "Tenure_Months")
    monthly = _as_float(payload, "Monthly_Charges")

    risk += max(min((12.0 - tenure) / 30.0, 0.25), -0.25)
    risk += max(min((monthly - 70.0) / 120.0, 0.25), -0.20)

    contract = str(payload.get("Contract_Type", "")).strip().lower()
    risk += {
        "month-to-month": 0.20,
        "one year": -0.08,
        "two year": -0.14,
    }.get(contract, 0.0)

    internet = str(payload.get("Internet_Service", "")).strip().lower()
    risk += {
        "fiber optic": 0.08,
        "dsl": 0.0,
        "no": -0.05,
    }.get(internet, 0.0)

    for col in [
        "Online_Security",
        "Online_Backup",
        "Device_Protection",
        "Tech_Support",
    ]:
        val = str(payload.get(col, "")).strip().lower()
        if val == "yes":
            risk -= 0.04
        elif val == "no":
            risk += 0.03

    paperless = str(payload.get("Paperless_Billing", "")).strip().lower()
    if paperless == "yes":
        risk += 0.03

    payment = str(payload.get("Payment_Method", "")).strip().lower()
    risk += {
        "electronic check": 0.07,
        "credit card": -0.01,
        "bank transfer": -0.01,
        "mailed check": -0.01,
    }.get(payment, 0.0)

    score = max(min((risk - 0.5) * 4.0, 6.0), -6.0)
    prob = 1.0 / (1.0 + math.exp(-score))
    return max(min(prob, 0.99), 0.01)


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
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, relative_path, content_type):
        file_path = ROOT / relative_path
        if not file_path.exists():
            self._send_json(404, {"error": "Not found"})
            return

        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_calendar_event(self, query):
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

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path in ("/api/features", "/api/features.py", "/features.py"):
            payload = {
                "features": FEATURES,
                "categorical_features": list(CATEGORICAL_OPTIONS.keys()),
                "categorical_options": CATEGORICAL_OPTIONS,
            }
            self._send_json(200, payload)
            return

        if path in ("/api/calendar-event", "/api/calendar_event"):
            self._send_calendar_event(query)
            return

        if path in ("/", "/index.html"):
            self._send_file("index.html", "text/html; charset=utf-8")
            return

        if path in ("/predictor", "/predictor.html"):
            self._send_file("predictor.html", "text/html; charset=utf-8")
            return

        if path == "/styles.css":
            self._send_file("styles.css", "text/css; charset=utf-8")
            return

        if path == "/tasktracker.html":
            self._send_file("tasktracker.html", "text/html; charset=utf-8")
            return

        self._send_json(404, {"error": "Not found"})

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        if path not in ("/api/predict", "/api/predict.py", "/predict.py"):
            self._send_json(404, {"error": "Not found"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(content_length).decode("utf-8")
            payload = json.loads(raw)
        except Exception:
            self._send_json(400, {"error": "Request must be valid JSON."})
            return

        if not isinstance(payload, dict):
            self._send_json(400, {"error": "Payload must be an object."})
            return

        for col in FEATURES:
            if col not in payload:
                self._send_json(400, {"error": f"Missing feature: {col}"})
                return

        churn_prob = _heuristic_churn_probability(payload)
        no_churn_prob = 1.0 - churn_prob
        prediction = 1 if churn_prob >= 0.5 else 0

        self._send_json(
            200,
            {
                "churn": int(prediction),
                "churn_probability": float(churn_prob),
                "no_churn_probability": float(no_churn_prob),
            },
        )
