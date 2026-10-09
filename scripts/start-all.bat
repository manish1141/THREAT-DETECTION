@echo off
title Starting ON-DEVICE THREAT GUARD (Backend + Frontend)
color 0B
cls

echo ================================================================
echo           ON-DEVICE THREAT GUARD - REAL-TIME CYBERSECURITY
echo           "Your Device. Your Security. Your Control."
echo ================================================================
echo.

set "ROOT=%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

echo [*] Starting Backend Hardware Daemon (Port 5174)...
start "ThreatGuard-Backend" /min cmd /c "cd /d "%ROOT%backend" && node server.js"

timeout /t 2 /nobreak >nul

echo [*] Starting Frontend React UI (Port 5173)...
start "ThreatGuard-Frontend" /min cmd /c "cd /d "%ROOT%frontend" && npm run dev -- --host --port 5173"

timeout /t 3 /nobreak >nul

echo [*] Opening ON-DEVICE THREAT GUARD in default browser...
start http://localhost:5173

echo.
echo ================================================================
echo  [SUCCESS] All separated modules are online!
echo  - Frontend Client:  http://localhost:5173
echo  - Backend Daemon:   http://localhost:5174/api/device-probe
echo ================================================================
echo.
pause
