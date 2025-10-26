@echo off
echo 🚀 Running OCPP Integration Tests
echo ====================================
cd /d "%~dp0"
node test-ocpp-integration.js
echo.
echo Press any key to exit...
pause > nul