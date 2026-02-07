@echo off
chcp 65001 >nul
setlocal EnableExtensions EnableDelayedExpansion

setlocal EnableExtensions

REM ---- SETTINGS
set "PORT=5500"
set "URL=http://localhost:%PORT%/"

REM ---- LOG FILE (in same folder as this bat)
set "LOG=%~dp0launcher_log.txt"
echo.>"%LOG%"
echo [LOG] Starting...>>"%LOG%"
echo [LOG] Folder: %~dp0>>"%LOG%"

REM ---- Go to site folder (folder where this .bat is)
cd /d "%~dp0" >>"%LOG%" 2>&1

REM ---- Find Python (py preferred)
set "PY="
where py >>"%LOG%" 2>&1
if not errorlevel 1 set "PY=py"

if "%PY%"=="" (
  where python >>"%LOG%" 2>&1
  if not errorlevel 1 set "PY=python"
)

if "%PY%"=="" (
  echo Python NOT found.
  echo.
  echo Open: https://www.python.org/downloads/windows/
  echo IMPORTANT: during install, check "Add python.exe to PATH".
  echo.
  echo [LOG] Python not found.>>"%LOG%"
  echo Log saved to: "%LOG%"
  pause
  exit /b 1
)

echo Python found: %PY%
%PY% --version
%PY% --version >>"%LOG%" 2>&1
if errorlevel 1 (
  echo Python found but not working.
  echo Log saved to: "%LOG%"
  pause
  exit /b 1
)

REM ✅ Messages BEFORE starting the server (will appear in the same window)
echo.
echo ✅ Step 2 validated! 🎉 The local server is about to start.
echo 🔥 Keep this window open (do NOT close it).
echo 🛑 To stop later: press CTRL+C then Y.
echo.
echo 🌐 IMPORTANT: To see the Quran Reader, open your browser and type:
echo    %URL%
echo    (Type it in the address bar, not in the search box.)
echo.

REM ---- Wait a bit then open browser (real open, not search)
timeout /t 1 /nobreak >nul
echo Opening: %URL%
rundll32.exe url.dll,FileProtocolHandler "%URL%" >>"%LOG%" 2>&1

echo.
echo Starting server now...
echo [LOG] Starting server: %PY% -m http.server %PORT%>>"%LOG%"
echo.

REM ---- Start server IN THIS SAME WINDOW (so its "Serving HTTP on..." shows here)
%PY% -m http.server %PORT%

REM If server stops, we reach here
echo.
echo Server stopped.
pause
exit /b 0
