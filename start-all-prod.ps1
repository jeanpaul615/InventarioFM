# Script para construir e iniciar el frontend y backend en modo producción

Write-Host "Construyendo Frontend..."
Set-Location -Path "front"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al construir el frontend. Abortando..." -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}
Set-Location -Path ".."

Write-Host "Construyendo Backend..."
Set-Location -Path "backend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al construir el backend. Abortando..." -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}
Set-Location -Path ".."

Write-Host "Iniciando Frontend en modo producción..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd front; npm start'

Write-Host "Iniciando Backend en modo producción..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd backend; npm run start:prod'

Write-Host "Ambos servidores están iniciándose en nuevas ventanas de PowerShell."

Write-Host "Abriendo navegador en http://localhost:3000/ ..."
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000/"
