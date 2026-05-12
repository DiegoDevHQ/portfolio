# NeuroForge

NeuroForge is an HTML-first AI concept playground with two generation paths: a local Python backend and a Study Buddy-style WebLLM + WebGPU runtime that can run directly in the browser on supported hardware.

## Features

- Modern single-page HTML/CSS/JS interface
- Prompt modes: invent, improve, pitch, code plan
- Local Python API endpoint for generation
- Optional C++ scoring engine (`braincore.cpp`) used when compiled
- Local WebLLM generation path with hardware scan, model recommendation, and on-device inference

## Run Frontend

Open `index.html` in your browser.

If you want the Study Buddy-style local runtime, serve NeuroForge from `localhost` or HTTPS so WebGPU and WebLLM can initialize correctly.

## Run Backend

```bash
cd backend
python server.py
```

Backend runs at `http://127.0.0.1:8008`.

## Local WebLLM Mode

- NeuroForge now includes a `Run Source` selector with `Backend API` and `Local WebLLM` options.
- The local mode scans device compatibility, recommends a model tier, and lets the user load a browser-side model like the Study Buddy app.
- First-time model downloads are large and can take a while depending on the selected model.
- If local mode is blocked, use a secure origin and a WebGPU-capable browser, or stay on backend mode.
- If you see `Unavailable` with `Unknown GPU`, you are usually on a browser surface that hides WebGPU. Run `open-neuroforge-webgpu.bat` from this folder to launch the localhost build in Chrome or Edge with WebGPU-friendly flags.

## Optional: Compile C++ Scoring Engine

From the `cpp` directory:

```bash
g++ braincore.cpp -O2 -o braincore.exe
```

If `braincore.exe` exists, backend will use it for creativity scoring.
