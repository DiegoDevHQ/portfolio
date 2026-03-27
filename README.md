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

4. **Task Tracker 2.0 (complete)**
OUT NOW on my website.

A full ground-up rebuild of the Task Tracker into a scheduling-first productivity app with reminders, calendar export, dark mode, 8-language support, and a mobile-friendly progressive disclosure UI.

#### Task Tracker 2.0 — Full Changelog

**Core Rebuild**
- Rebuilt the entire Task Tracker UI from scratch into a modern scheduling-first workspace.
- New task schema: per-task `createdAt`, `scheduledAt`, `deadlineAt`, `completedAt`, `reminderOffsetMinutes`, `reminderSentAt`, and `subtasks` array.
- Auto-migration from legacy v1.x localStorage format to v2.0 schema on first load.
- All state persists to `taskTrackerDataV200` in localStorage — survives page refreshes, browser restarts, and tab closures.

**Scheduling & Deadlines**
- Added datetime-local inputs for scheduling a task start time and setting a hard deadline.
- Added overdue detection: tasks past their deadline show a red "Overdue" indicator.
- Added due-soon detection: tasks within 24 hours of deadline show an amber "Due soon" pill.

**Reminders & Notifications**
- Added browser notification support (Notifications API) with permission gating.
- Added configurable reminder lead times per task: 5 min, 15 min, 30 min, 1 hour, 1 day before deadline.
- Reminder checks run every 30 seconds while the app tab is open.
- Added a reminder banner in the UI showing how many reminders are approaching.

**Calendar Integration**
- Added Google Calendar export: opens pre-filled event in Google Calendar (web-first).
- Added Device Calendar export: generates RFC 5545 `.ics` file for any task with a date.
  - On iOS/Android: triggers native share sheet to add directly to Apple Calendar, Google Calendar, Samsung Calendar, etc.
  - Fallback: downloads `.ics` file if Web Share API is unavailable.
- Added a visible "🗓️ Calendar" button in the composer row for one-click calendar export of the current task input.

**Dark Mode**
- Added dark mode with full CSS custom property theming (`--bg-1`, `--surface`, `--text`, `--primary`, etc.).
- Added system theme auto-detection via `prefers-color-scheme` on first load.
- Added persistent theme preference saved to localStorage.
- Added `color-scheme: light/dark` on datetime pickers so native calendar dropdowns match the active theme.

**Multilingual Support (8 Languages)**
- Added full UI translations for: English, Spanish, French, Arabic, Hindi, Portuguese, Chinese (Simplified), Romanian.
- Added device language auto-detection via `navigator.language` on first load, with manual override via dropdown.
- All 60+ UI strings translated per language including buttons, labels, placeholders, alerts, and banners.
- Language preference saved to localStorage and restored on reload.

**Progressive Disclosure UI**
- Simplified initial screen to just: task input + Advanced button + 🗓️ Calendar button + Add button.
- Advanced section (hidden by default): schedule input, deadline input, reminder selector.
- More Filters toggle (hidden by default): Scheduled and Overdue filter chips.
- Task actions: Complete + More always visible; Edit, Calendar, Device Calendar, Subtask, Delete expand on "More" click.
- All toggles reset on page load for a clean starting state.

**Mobile Friendliness**
- Added proper `viewport` meta tag for mobile scaling.
- Responsive CSS grid with breakpoints at 980px (tablet) and 720px (phone).
- `writing-mode: horizontal-tb` and `text-orientation: mixed` enforced globally to prevent rotated text bugs.
- Device Calendar uses `navigator.share()` for native iOS/Android share sheet integration.
- Touch-friendly button sizing and spacing throughout.

**Dashboard**
- Stats bar: Total, Active, Completed, Due Soon counters update live.
- Progress bar fills as tasks are completed with smooth CSS transition.

**Subtasks**
- Nested subtask support with individual complete, edit, and delete actions.
- Parent task auto-completes when all subtasks are done.
- Subtask progress summary shown on each task card.

**Celebration UX**
- Confetti animation fires on task or subtask completion via `js-confetti` CDN library.

**Page Title**
- Updated app title to "Task Tracker 2.0" across all 8 languages.

#### Task Tracker 2.0.1 Hotfix Patch Notes

- Fixed mobile task action buttons where the "More" label could render vertically.
- Updated small-screen action button sizing and text wrapping so labels stay horizontal.
- Improved expanded task action readability on phones without changing desktop layout.

#### Reminder Behavior Notes

- Browser notifications require explicit user permission grant.
- Reminder checks run on a 30-second interval while the tab is open (static-hosting compatible).
- Calendar exports create durable reminders in external calendar apps independent of the web app running.

#### Task Tracker 1.2.0 Patch Notes

- Added a progress dashboard with total, active, and completed task stats.
- Added a visual completion bar so users can see overall momentum at a glance.
- Added task search across both task names and subtask text.
- Added task filters for All, Active, and Completed states.
- Added a bulk Clear Completed action for faster cleanup after finishing a work session.
- Added subtask progress summaries on each task card so users can see child progress without opening edit controls.
- Added contextual empty states for both brand-new lists and filtered search results.
- Improved mobile responsiveness for the expanded control layout and dashboard blocks.

#### Why These Changes (More Feedback)

- Users needed faster list triage once the tracker had more items, so search and status filters were added.
- Users wanted better visibility into real progress, so a dashboard and completion bar were added above the list.
- Users asked for a quicker reset after finishing work, so completed tasks can now be cleared in one action.
- Users needed subtask progress to be visible without extra clicks, so each task now shows a completed-subtasks summary.
- Users can get confused by blank filtered results, so the empty state now explains whether the list is empty or just filtered down to nothing.

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
