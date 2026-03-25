# Diego Dev HQ Portfolio

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

#### Task Tracker 1.1.1 Hotfix Patch Notes

- Added language selector with support for English, Spanish, and Mandarin.
- Added automatic task persistence with local storage so tasks are retained after refresh.
- Updated accidental refresh/leave protection to warn only when unsaved draft text is present.
- Added task editing so users can rename existing tasks.
- Added nested subtasks under each task (for example: Clean House -> Kitchen, Bathroom).
- Added per-subtask edit and delete controls.
- Changed subtasks input flow to open only when the Subtask action is clicked.
- Updated task controls to keep Complete exposed, with a Manage button that reveals edit/delete/subtask actions.
- Updated Manage button styling to orange for clearer action hierarchy.
- Replaced the completion sound with a softer celebratory chime and lowered playback intensity.
- Added complete button for each subtask.
- Updated task completion logic so a parent task automatically completes when all subtasks are complete.
- Made subtasks always visible in the task card (not hidden behind Manage).

#### Why These Changes (User Feedback)

- Users asked for multilingual support, so EN/ES/ZH language options were added.
- Users reported losing tasks on refresh, so auto-save persistence was added.
- Users found refresh warnings too aggressive, so warnings now trigger only for unsaved typed drafts.
- Users requested better task control visibility, so Complete stays exposed and Manage reveals advanced actions.
- Users wanted subtasks to feel easier and more structured, so subtasks now support inline creation plus edit/delete actions.
- Users asked for less harsh audio feedback, so completion sound was changed to a softer celebratory cue.
- Users asked for clearer subtask progress, so each subtask now has its own complete action.
- Users wanted parent progress to reflect child progress, so the main task now auto-completes when all subtasks are done.
- Users asked to always see subtasks, so subtasks are now always visible under each task.

---

5. **Customer Churn Predictor (complete)**
OUT NOW on my website.

A machine learning-focused project designed to predict customer churn and highlight retention insights.

### Churn Predictor Troubleshooting Notes (What Broke + Fixes)

- Issue: `Failed to load form. Make sure the server is running.` on `predictor.html`.
- Cause: API route returned an error in deployment, so `/api/features` failed.
- Fix: Updated API handlers in `api/features.py` and `api/predict.py` to Vercel-compatible Python handler format and redeployed.

- Issue: Vercel warning about `builds` and ignored Project Build Settings.
- Cause: Older config style in `vercel.json`.
- Fix: Removed `builds` usage and simplified routing config.

- Issue: `Function Runtimes must have a valid version...`.
- Cause: Invalid runtime value in `vercel.json`.
- Fix: Removed explicit runtime override and used default Python function detection.

- Issue: `The pattern "api/*.py" defined in functions doesn't match...`.
- Cause: Functions glob config mismatch in Vercel validation.
- Fix: Removed `functions` glob override and relied on standard `api/` auto-detection.

- Issue: `No Output Directory named "public" found after Build completed.`
- Cause: Build step expected static output folder.
- Fix: Added a build step in `package.json` that creates `public/` and copies static files, and set `outputDirectory` to `public` in `vercel.json`.

- Issue: Local testing confusion between static server, Flask, and Vercel routes.
- Fix: Verified local testing paths and used `vercel dev` / local Flask fallback only for testing before production deploy.

- Issue: Churn form sometimes still failed to render in production even when static page loaded.
- Cause: Temporary API unavailability at `/api/features` blocked dynamic form generation.
- Fix: Added a fallback schema in `predictor.html` so the form still renders with known feature fields and category options if `/api/features` fails.

- Issue: Public portfolio visitors could still see fallback behavior if API base resolution tried localhost paths.
- Cause: Mixed environment API lookup logic can accidentally include local-only endpoints that are unreachable for public users.
- Fix: Updated `predictor.html` API resolution to prioritize same-origin `/api` on HTTPS production, keep localhost fallbacks for local development only, and use timeout/retry before switching to fallback schema.

- Issue: Repeated redeploy loops from pushing too many unrelated files during troubleshooting.
- Fix: For predictor deployment errors, push only the changed troubleshooting files (`vercel.json`, `package.json`, `api/features.py`, `api/predict.py`, `predictor.html`) and redeploy.

- Issue: Persistent `404 NOT_FOUND` for `/api/predict` and `/api/predict.py` during production testing.
- Cause: Route and deployment entrypoint mismatch across preview URLs/config revisions, plus Flask dependency import errors in serverless runtime.
- Fix: Standardized API calls to `/api/features` and `/api/predict`, simplified `vercel.json` to minimal config, and moved runtime handling to dependency-free `app.py` serverless entrypoint.

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
- `app.py` - Vercel serverless entrypoint serving static routes and churn API endpoints
- `api/predict.py`, `api/features.py` - auxiliary endpoint handlers kept for compatibility/testing
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
