# Task Tracker 2.0 — changelog

Live at https://diegodevhq.space/tasktracker.html. Every release below came from real user feedback.

A full ground-up rebuild of the Task Tracker into a scheduling-first productivity app with reminders, calendar export, dark mode, 8-language support, and a mobile-friendly progressive disclosure UI.

## Task Tracker 2.0 — Full Changelog

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

## Task Tracker 2.0.1 Hotfix Patch Notes

- Fixed mobile task action buttons where the "More" label could render vertically.
- Updated small-screen action button sizing and text wrapping so labels stay horizontal.
- Improved expanded task action readability on phones without changing desktop layout.

## Task Tracker 2.0.2 Hotfix Patch Notes

- Fixed iOS Device Calendar flow that could trigger an `unknown.ics` forced download/share prompt.
- Updated iPhone/iPad calendar behavior to open the native Calendar app directly using `calshow:`.
- iOS now skips ICS file generation entirely in the device-calendar flow to prevent download interruptions.

## Task Tracker 2.0.3 Hotfix Patch Notes

- Fixed Advanced composer fields so the date controls no longer overflow outside the composer border across mobile, desktop, and laptop layouts.
- Added visible schedule and deadline helper labels so all users see `Click to add date` instead of blank date fields.
- Improved advanced composer sizing across devices to keep date and reminder controls inside the card layout.

## Task Tracker 2.0.4 Hotfix Patch Notes

- Fixed iOS Device Calendar behavior that could jump to the wrong year and fail to preserve task event details.
- Replaced the iPhone/iPad `calshow:` shortcut path with a real server-served calendar event endpoint.
- iOS calendar exports now send a proper `.ics` event response with the task title, date, and time included.

## Task Tracker 2.0.5 Hotfix Patch Notes

- Fixed production `404 Not Found` errors for iOS calendar exports on Vercel.
- Added a dedicated `api/calendar_event.py` serverless function so the calendar export route exists as a real deployed endpoint.
- Updated Task Tracker to use the deployed calendar function path consistently in both production and local routing.

## Task Tracker 2.0.6 Hotfix Patch Notes

- Improved iOS calendar export handoff so Safari no longer tends to sit on a blank white viewer screen after approval.
- Updated iPhone/iPad calendar export to open through a temporary tab and attempt to close it after the handoff starts.
- Changed calendar event responses to download as attachments instead of remaining inline in the browser view.

## Task Tracker 2.0.7 Hotfix Patch Notes

- Reworked the iOS calendar launcher tab so it stays on a controlled helper page instead of falling back to Safari's blank white file viewer.
- Calendar import now starts from a hidden frame inside the temporary tab, then attempts to close or return automatically.
- Improved post-import recovery on iPhone/iPad after the Calendar permission prompt and handoff flow.

## Task Tracker 2.0.8 Hotfix Patch Notes

- Replaced the iOS temporary-tab calendar handoff with a hidden iframe on the current Task Tracker page.
- Reduced the chance of Safari or Chrome on iPhone returning users to a blank white screen after the Calendar permission prompt.
- Kept the calendar import flow on the existing page so the app stays visually stable during the iOS handoff.

## Task Tracker 2.0.9 Hotfix Patch Notes

- Added an iPhone/iPad calendar chooser so users can pick Apple Calendar or Google Calendar before export.
- Keeps Apple Calendar available while providing a more reliable Google Calendar fallback when iOS browser handoff behavior is disruptive.
- Avoids forcing every iOS user through the same native Calendar import path.

## Task Tracker 2.0.10 Hotfix Patch Notes

- Added a Chrome on iPhone fallback that skips the native Apple Calendar import flow entirely.
- Chrome on iOS now opens Google Calendar directly because the Apple import handoff kept returning users to a blank white browser screen.
- Keeps the Apple-vs-Google chooser for Safari on iPhone while using a more reliable browser-specific default on `CriOS`.

## Task Tracker 2.0.11 Hotfix Patch Notes

- Removed the forced Chrome-on-iOS Google Calendar redirect.
- iPhone/iPad users now get the same Apple vs Google calendar choice modal in both Safari and Chrome.
- Restored user control so Chrome on iOS no longer bypasses the calendar option prompt.

## Task Tracker 2.0.12 Hotfix Patch Notes

- Added a desktop/laptop calendar chooser for Device Calendar actions.
- Desktop users can now choose Google Calendar, Microsoft Calendar (Outlook), or direct `.ics` download.
- Updated calendar flow to avoid forcing desktop users into a single export path.

## Reminder Behavior Notes

- Browser notifications require explicit user permission grant.
- Reminder checks run on a 30-second interval while the tab is open (static-hosting compatible).
- Calendar exports create durable reminders in external calendar apps independent of the web app running.

## Task Tracker 1.2.0 Patch Notes

- Added a progress dashboard with total, active, and completed task stats.
- Added a visual completion bar so users can see overall momentum at a glance.
- Added task search across both task names and subtask text.
- Added task filters for All, Active, and Completed states.
- Added a bulk Clear Completed action for faster cleanup after finishing a work session.
- Added subtask progress summaries on each task card so users can see child progress without opening edit controls.
- Added contextual empty states for both brand-new lists and filtered search results.
- Improved mobile responsiveness for the expanded control layout and dashboard blocks.

## Why These Changes (More Feedback)

- Users needed faster list triage once the tracker had more items, so search and status filters were added.
- Users wanted better visibility into real progress, so a dashboard and completion bar were added above the list.
- Users asked for a quicker reset after finishing work, so completed tasks can now be cleared in one action.
- Users needed subtask progress to be visible without extra clicks, so each task now shows a completed-subtasks summary.
- Users can get confused by blank filtered results, so the empty state now explains whether the list is empty or just filtered down to nothing.

## Task Tracker 1.1.1 Hotfix Patch Notes

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

## Why These Changes (User Feedback)

- Users asked for multilingual support, so EN/ES/ZH language options were added.
- Users reported losing tasks on refresh, so auto-save persistence was added.
- Users found refresh warnings too aggressive, so warnings now trigger only for unsaved typed drafts.
- Users requested better task control visibility, so Complete stays exposed and Manage reveals advanced actions.
- Users wanted subtasks to feel easier and more structured, so subtasks now support inline creation plus edit/delete actions.
- Users asked for less harsh audio feedback, so completion sound was changed to a softer celebratory cue.
- Users asked for clearer subtask progress, so each subtask now has its own complete action.
- Users wanted parent progress to reflect child progress, so the main task now auto-completes when all subtasks are done.
- Users asked to always see subtasks, so subtasks are now always visible under each task.
