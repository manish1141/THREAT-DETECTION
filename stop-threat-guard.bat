@echo off
title Stopping ON-DEVICE THREAT GUARD
color 0C
cls

echo ================================================================
echo           STOPPING ON-DEVICE THREAT GUARD SERVERS
echo ================================================================
echo.

echo [*] Stopping port 5173 (Vite Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [*] Stopping port 5174 (Hardware Telemetry Probe)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [DONE] Threat Guard services have been stopped.
echo.
pause
