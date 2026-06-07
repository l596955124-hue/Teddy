@echo off
set "EDGE_EXE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE_EXE%" (
  echo Edge executable not found: %EDGE_EXE%
  exit /b 1
)
start "" "%EDGE_EXE%" --remote-debugging-port=9223 --no-first-run --no-default-browser-check https://www.1688.com/
echo Edge launched with remote debugging port 9223.
