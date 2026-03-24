import json
import pickle
from http.server import BaseHTTPRequestHandler
from pathlib import Path


def _find_root():
    candidate = Path(__file__).resolve().parent
    for _ in range(5):
        if (candidate / "model.pkl").exists():
            return candidate
        candidate = candidate.parent
    return Path(__file__).resolve().parent.parent.parent


ROOT = _find_root()
MODEL_PATH = ROOT / "model.pkl"
ENCODERS_PATH = ROOT / "label_encoders.pkl"
FEATURES_PATH = ROOT / "feature_columns.pkl"

model = None
label_encoders = None
feature_columns = None


def _load_artifacts():
    global model, label_encoders, feature_columns
    if model is not None and label_encoders is not None and feature_columns is not None:
        return

    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    with open(ENCODERS_PATH, "rb") as f:
        label_encoders = pickle.load(f)

    with open(FEATURES_PATH, "rb") as f:
        feature_columns = pickle.load(f)


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
            _load_artifacts()
        except Exception as exc:
            self._send_json(500, {"error": f"Model artifacts failed to load: {exc}"})
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

        row = []
        for col in feature_columns:
            if col not in payload:
                self._send_json(400, {"error": f"Missing feature: {col}"})
                return

            value = payload[col]
            if col in label_encoders:
                try:
                    value = label_encoders[col].transform([value])[0]
                except Exception as exc:
                    self._send_json(400, {"error": f"Invalid category for {col}: {value}. {exc}"})
                    return

            row.append(float(value))

        prediction = model.predict([row])[0]
        prob = model.predict_proba([row])[0]
        self._send_json(
            200,
            {
                "churn": int(prediction),
                "churn_probability": float(prob[1]),
                "no_churn_probability": float(prob[0]),
            },
        )
