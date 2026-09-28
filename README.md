# Diego A. Ortega — Portfolio

Source for **[diegodevhq.space](https://diegodevhq.space)**, my portfolio, including live in-browser demos of the systems I build.

I'm a software engineer with ten years building and running production software as the only technical resource for a multi-location dental practice. I work mainly in Python and JavaScript, across networking, automation and local AI. **[Résumé (PDF)](resume/Diego-Ortega-Resume.pdf)**

## Try it live

| Demo | What it shows |
|---|---|
| [GonzalezDesk Lite](https://diegodevhq.space/projects/GonzalezDesk/index.html) | The streaming engine from my production remote desktop platform, with both ends running in one tab. Changed screen tiles are JPEG-encoded, packed behind the real 12-byte binary header, and decoded on the other side, with live bandwidth and packet readouts. You can drag windows and type into the remote desktop. |
| [JARVIS Lite](https://diegodevhq.space/projects/Jarvis/index.html) | A browser version of my offline Windows AI agent. Every reply shows its tool calls. An autonomy policy asks before risky actions, hard rails block dangerous ones, and it supports voice in and out and per-chat memory. |
| [AI Study Buddy](https://diegodevhq.space/studybuddy.html) | Runs real language models locally on your GPU through WebLLM and WebGPU, with no server and no API cost. |

## Highlights

- **GonzalezDesk** (in production at my job). A custom remote desktop platform in Python, including client, relay server, installers and a remote update pipeline, that replaced commercial per-seat licensing. The v2 engine (binary wire protocol plus a tile-delta codec) benchmarked at **10× less data** and **7× less host CPU per frame** at 1920×1080. Owner access is secured with Ed25519 device keys.
- **J.A.R.V.I.S v2** (personal). A fully offline Windows agent on a local qwen3:14b model with **48 tools** in 6 packs, a plan → call → observe loop, three autonomy modes and hard safety rails. Turning the model's thinking mode off by default made replies **2.9× faster** with no loss in tool accuracy.

The source for those two isn't public. The demos above show how they work.

## What's in this repo

- `index.html`, `styles.css` — the portfolio
- `projects/` — demos: GonzalezDesk, Jarvis, NeuroForge, DoomsdayTracker, and earlier UI prototypes (SteemStore, UTube, Amazyn, PixelRaiders)
- `studybuddy.html`, `tasktracker.html` — standalone apps ([Task Tracker changelog](docs/task-tracker-changelog.md), shaped by user feedback)
- `api/contact.py` — contact form to email via Resend, standard library only
- `api/calendar_event.py` — `.ics` calendar export for Task Tracker

Plain HTML, CSS and JavaScript with no build step, plus two Python serverless functions on Vercel.

## Contact

diegoaogc@gmail.com · [LinkedIn](https://www.linkedin.com/in/diego-ortega-b869233b8/) · Pomona, CA
