@echo off
echo =========================================================================
echo Starting BizSahayak Full Stack Platform
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo =========================================================================

start "BizSahayak Backend (Spring Boot)" cmd /k "cd /d %~dp0backend && mvn.cmd spring-boot:run"
start "BizSahayak Frontend (React Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Both servers launching in separate terminal windows!
