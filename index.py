import json
from http.server import BaseHTTPRequestHandler

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


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        payload = {
            "features": FEATURES,
            "categorical_features": list(CATEGORICAL_OPTIONS.keys()),
            "categorical_options": CATEGORICAL_OPTIONS,
        }
        self._send_json(200, payload)
