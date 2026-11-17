@echo off
setlocal EnableExtensions
cd /d "%~dp0"
echo Starting JEE One Shot OS 4.0.0...
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18 or newer is required. Install Node.js and try again.
  pause
  exit /b 1
)
start "JEE One Shot OS Server" /min cmd /c "cd /d ""%~dp0"" && set PORT=4000 && node server.js"
set "READY=0"
for /l %%i in (1,1,30) do (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ok=$false; try {$r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4000/health' -TimeoutSec 1; if($r.StatusCode -eq 200){$ok=$true}} catch {}; if($ok){exit 0}else{exit 1}"
  if not errorlevel 1 (
    set "READY=1"
    goto ready
  )
  timeout /t 1 /nobreak >nul
)
if "%READY%"=="0" (
  echo.
  echo JEE One Shot OS did not become ready on http://localhost:4000
  echo Check the JEE One Shot OS Server window.
  pause
  exit /b 1
)
:ready
echo JEE One Shot OS is ready. Opening browser...
"%SystemRoot%\explorer.exe" "http://localhost:4000/"
exit /b 0
