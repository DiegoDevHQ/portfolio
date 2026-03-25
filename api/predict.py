import json
import math
from http.server import BaseHTTPRequestHandler

FEATURE_COLUMNS = [
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


def _as_float(payload, key):
    try:
        return float(payload.get(key, 0))
    except Exception:
        return 0.0


def _heuristic_churn_probability(payload):
    risk = 0.15

    tenure = _as_float(payload, "Tenure_Months")
    monthly = _as_float(payload, "Monthly_Charges")

    # Short tenure and higher monthly charges generally increase churn risk.
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

    # Convert bounded risk score to smooth probability.
    score = max(min((risk - 0.5) * 4.0, 6.0), -6.0)
    prob = 1.0 / (1.0 + math.exp(-score))
    return max(min(prob, 0.99), 0.01)


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
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

        for col in FEATURE_COLUMNS:
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

    def do_GET(self):
        self._send_json(405, {"error": "Use POST for this endpoint."})
