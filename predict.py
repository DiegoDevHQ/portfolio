import json
import pickle
from pathlib import Path

# Load artifacts once per cold start.
ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = ROOT / "model.pkl"
ENCODERS_PATH = ROOT / "label_encoders.pkl"
FEATURES_PATH = ROOT / "feature_columns.pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(ENCODERS_PATH, "rb") as f:
    label_encoders = pickle.load(f)

with open(FEATURES_PATH, "rb") as f:
    feature_columns = pickle.load(f)


def handler(request):
    try:
        payload = request.get_json(force=True)
    except Exception:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Request must be JSON."}),
            "headers": {"content-type": "application/json"},
        }

    # Validate and coerce
    if not isinstance(payload, dict):
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Payload must be an object."}),
            "headers": {"content-type": "application/json"},
        }

    # Build row in expected order.
    row = []
    for col in feature_columns:
        if col not in payload:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": f"Missing feature: {col}"}),
                "headers": {"content-type": "application/json"},
            }

        value = payload[col]

        # For categorical features apply encoder
        if col in label_encoders:
            try:
                value = label_encoders[col].transform([value])[0]
            except Exception as exc:
                return {
                    "statusCode": 400,
                    "body": json.dumps({"error": f"Invalid category for {col}: {value}. {exc}"}),
                    "headers": {"content-type": "application/json"},
                }

        row.append(float(value))

    prediction = model.predict([row])[0]
    prob = model.predict_proba([row])[0]

    return {
        "statusCode": 200,
        "body": json.dumps({
            "churn": int(prediction),
            "churn_probability": float(prob[1]),
            "no_churn_probability": float(prob[0]),
        }),
        "headers": {"content-type": "application/json"},
    }
