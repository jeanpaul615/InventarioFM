# Script para iniciar el frontend y backend en paralelo usando PowerShell

# Cargar configuración centralizada
. "$PSScriptRoot\config.ps1"

Write-Host "Iniciando Frontend..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd front; npm run dev'

Write-Host "Iniciando Backend..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd backend; npm run start:dev'

Write-Host "Ambos servidores están iniciándose en nuevas ventanas de PowerShell."

Write-Host "Abriendo navegador en $FRONTEND_URL ..."
Start-Sleep -Seconds 3
Start-Process "$FRONTEND_URL"
