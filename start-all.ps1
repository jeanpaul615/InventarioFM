# Script para iniciar el frontend y backend en paralelo usando PowerShell

Write-Host "Iniciando Frontend..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd front; npm run dev'

Write-Host "Iniciando Backend..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd backend; npm run start:dev'

Write-Host "Ambos servidores están iniciándose en nuevas ventanas de PowerShell."

Write-Host "Abriendo navegador en http://localhost:3000/ ..."
Start-Process "http://localhost:3000/"
