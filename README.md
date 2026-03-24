# Diego Dev HQ Portfolio + Churn Predictor

This repository contains a personal portfolio site and a machine learning demo for customer churn prediction.

## About
Diego Dev HQ's Portfolio
This is a personal developer portfolio focused on rebuilding and improving large-scale platforms with better UX and clean engineering.

---

### Live Site
OUT NOW https://diegodevhq.vercel.app/

---

## Projects

1. **SteemStore (in progress)**

A UX-focused reimagining of a digital game storefront inspired by Steam.

---

2. **Video Platform (YouTube-inspired) (in progress)**

A simplified video platform focused on improving watch experience and content discovery.

---

3. **E-commerce Platform (Amazon-inspired) (in progress)**

A redesigned shopping experience focused on clarity, better product pages, and smoother checkout flow.

---

4. **Task Tracker (complete)**
OUT NOW on my website.

A productivity-focused task management app built to help users organize work clearly and efficiently.

---

5. **Customer Churn Predictor (complete)**
OUT NOW on my website.

A machine learning-focused project designed to predict customer churn and highlight retention insights.

---

## Languages Learned

1. HTML
2. CSS
3. JavaScript
4. Python
5. React (planned)
6. Full-stack development (planned)

---

## Repository structure

- `index.html` - main portfolio page
- `predictor.html` - local churn predictor UI
- `styles.css` - site styling
- `customer_data.csv` - dataset used for training
- `generate_customer_data.py` - synthetic data generator
- `churn_predictor.py` - local training demo (removed from deploy path)
- `model.pkl`, `label_encoders.pkl`, `feature_columns.pkl` - trained model artifacts
- `api/predict.py` - Vercel serverless prediction endpoint
- `api/features.py` - Vercel serverless features metadata endpoint
- `requirements.txt` - Python dependencies
- `vercel.json` - Vercel config
- `.venv` / `.venv-1` - local virtual environments (ignored for Git)

---

## Local setup

1. Create/activate the virtual environment in `d:\my websitecode`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Ensure model artifacts exist (`model.pkl`, `label_encoders.pkl`, `feature_columns.pkl`). If not, run training step:

```powershell
python - <<'PY'
import pandas as pd, pickle
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

full = pd.read_csv('customer_data.csv')

m = full.drop('CustomerID', axis=1)
enc = {}
for c in m.select_dtypes(include=['object']).columns:
    le = LabelEncoder(); m[c] = le.fit_transform(m[c].astype(str)); enc[c] = le

X = m.drop('Churn', axis=1); y = m['Churn']
model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1).fit(X,y)

with open('model.pkl','wb') as f: pickle.dump(model,f)
with open('label_encoders.pkl','wb') as f: pickle.dump(enc,f)
with open('feature_columns.pkl','wb') as f: pickle.dump(list(X.columns),f)
print('saved artifacts')
PY
```

3. Run Vercel dev

```powershell
npm install -g vercel
vercel dev
```

4. Open

- Portfolio: `http://localhost:3000`
- Predictor: `http://localhost:3000/predictor.html`

---

## API endpoints

- `GET /api/features` returns feature names and categorical options.
- `POST /api/predict` accepts JSON body (keys are feature names) and returns churn prediction.

Example:

```bash
curl -X POST https://.../api/predict \
  -H 'Content-Type: application/json' \
  -d '{"gender":"Female", "SeniorCitizen":0, ... }'
```

---

## Git + Vercel deploy

```bash
git init
git add .
git commit -m "Initial portfolio + churn predictor deployment"
# push to your GitHub
# configure Vercel for the repo
vercel --prod
```

---

## Notes

- Vercel handles static HTML and serverless endpoints well.
- Keep the `.pkl` model < 50MB for front-end performance.
- If you prefer, host model endpoint separately (e.g., Render/Heroku) and keep the site on Vercel.
