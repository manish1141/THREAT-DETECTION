@echo off
title ON-DEVICE THREAT GUARD - Starting Real-Time Security Suite
color 0B
cls

echo ================================================================
echo           ON-DEVICE THREAT GUARD - REAL-TIME CYBERSECURITY
echo           "Your Device. Your Security. Your Control."
echo ================================================================
echo.

:: Ensure Node.js is available
set "PATH=C:\Program Files\nodejs;%PATH%"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in system PATH.
    echo Please make sure Node.js is installed.
    pause
    exit /b
)

echo [*] Starting Local Hardware & Windows Telemetry Daemon (Port 5174)...
start "ThreatGuard-Telemetry-Probe" /min node server-probe.js

timeout /t 2 /nobreak >nul

echo [*] Starting Vite Frontend Server (Port 5173)...
start "ThreatGuard-Dashboard" /min cmd /c "npm run dev -- --host --port 5173"

timeout /t 3 /nobreak >nul

echo [*] Launching ON-DEVICE THREAT GUARD in your default web browser...
start http://localhost:5173

echo.
echo ================================================================
echo  [SUCCESS] Application is running independently!
echo  - Frontend Dashboard:   http://localhost:5173
echo  - Hardware Probe:       http://localhost:5174/api/device-probe
echo.
echo  You can close this launcher window at any time.
echo  To stop Threat Guard completely, run: stop-threat-guard.bat
echo ================================================================
echo.
pause
