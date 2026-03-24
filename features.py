import json
import pickle
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FEATURES_PATH = ROOT / "feature_columns.pkl"
ENCODERS_PATH = ROOT / "label_encoders.pkl"

with open(FEATURES_PATH, "rb") as f:
    feature_columns = pickle.load(f)

with open(ENCODERS_PATH, "rb") as f:
    label_encoders = pickle.load(f)


def handler(request):
    return {
        "statusCode": 200,
        "body": json.dumps({
            "features": feature_columns,
            "categorical_features": list(label_encoders.keys()),
            "categorical_options": {k: list(v.classes_) for k, v in label_encoders.items()},
        }),
        "headers": {"content-type": "application/json"},
    }
