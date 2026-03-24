import json
import pickle
from http.server import BaseHTTPRequestHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FEATURES_PATH = ROOT / "feature_columns.pkl"
ENCODERS_PATH = ROOT / "label_encoders.pkl"

with open(FEATURES_PATH, "rb") as f:
    feature_columns = pickle.load(f)

with open(ENCODERS_PATH, "rb") as f:
    label_encoders = pickle.load(f)


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        payload = {
            "features": feature_columns,
            "categorical_features": list(label_encoders.keys()),
            "categorical_options": {k: list(v.classes_) for k, v in label_encoders.items()},
        }
        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
