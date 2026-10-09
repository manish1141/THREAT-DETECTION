@echo off
title Stopping ON-DEVICE THREAT GUARD Services
color 0C
cls

echo ================================================================
echo           STOPPING ALL THREAT GUARD INSTANCES
echo ================================================================
echo.

echo [*] Terminating Frontend on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [*] Terminating Backend on port 5174...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [DONE] Threat Guard frontend and backend have been safely stopped.
echo.
pause
