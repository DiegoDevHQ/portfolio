import json
import pickle
from http.server import BaseHTTPRequestHandler
from pathlib import Path

def _find_root():
    candidate = Path(__file__).resolve().parent
    for _ in range(4):
        if (candidate / "feature_columns.pkl").exists():
            return candidate
        candidate = candidate.parent
    return Path(__file__).resolve().parent.parent

ROOT = _find_root()
FEATURES_PATH = ROOT / "feature_columns.pkl"
ENCODERS_PATH = ROOT / "label_encoders.pkl"

feature_columns = None
label_encoders = None


def _load_artifacts():
    global feature_columns, label_encoders
    if feature_columns is not None and label_encoders is not None:
        return

    with open(FEATURES_PATH, "rb") as f:
        feature_columns = pickle.load(f)

    with open(ENCODERS_PATH, "rb") as f:
        label_encoders = pickle.load(f)


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        try:
            _load_artifacts()
        except Exception as exc:
            self._send_json(500, {"error": f"Feature artifacts failed to load: {exc}"})
            return

        payload = {
            "features": feature_columns,
            "categorical_features": list(label_encoders.keys()),
            "categorical_options": {k: list(v.classes_) for k, v in label_encoders.items()},
        }
        self._send_json(200, payload)
