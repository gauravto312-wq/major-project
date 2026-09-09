# BizSahayak Full-Stack Launcher Script
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "Starting BizSahayak Full Stack Platform" -ForegroundColor Green
Write-Host "Backend:  http://localhost:8080 (Swagger: http://localhost:8080/swagger-ui.html)" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "=========================================================================" -ForegroundColor Cyan

# Launch Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/backend'; .\mvn.cmd spring-boot:run"

# Launch Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/frontend'; npm run dev"

Write-Host "Both servers launched in parallel PowerShell windows!" -ForegroundColor Green
