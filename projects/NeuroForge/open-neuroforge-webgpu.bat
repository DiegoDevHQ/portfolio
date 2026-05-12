@echo off
setlocal

set "ROOT=%~dp0"
set "VENV_PY=%ROOT%..\..\.venv-1\Scripts\python.exe"
set "BACKEND_PORT=8008"
set "FRONTEND_PORT=8010"
set "URL=http://127.0.0.1:%FRONTEND_PORT%/index.html?v=chrome-webgpu-force"

set "BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%BROWSER%" set "BROWSER=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

if not exist "%BROWSER%" (
  echo No supported desktop browser was found. Install Chrome or Edge, then try again.
  exit /b 1
)

if exist "%VENV_PY%" (
  netstat -ano | findstr ":%BACKEND_PORT%" >nul
  if errorlevel 1 start "NeuroForge Backend" "%VENV_PY%" "%ROOT%backend\server.py"

  netstat -ano | findstr ":%FRONTEND_PORT%" >nul
  if errorlevel 1 start "NeuroForge Frontend" "%VENV_PY%" -m http.server %FRONTEND_PORT% --directory "%ROOT%"
) else (
  echo Python virtual environment not found at "%VENV_PY%".
  echo Browser will still open, but make sure the backend and frontend servers are already running.
)

set "PROFILE=%TEMP%\neuroforge-chrome-webgpu"
if not exist "%PROFILE%" mkdir "%PROFILE%" >nul 2>&1

start "NeuroForge WebGPU" "%BROWSER%" --user-data-dir="%PROFILE%" --new-window --enable-unsafe-webgpu --ignore-gpu-blocklist --enable-features=Vulkan,UseSkiaRenderer "%URL%"

endlocal