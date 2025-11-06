# Script para convertir start-all.ps1 a ejecutable

Write-Host "Instalando ps2exe si no está instalado..."
if (-not (Get-Module -ListAvailable -Name ps2exe)) {
    Install-Module -Name ps2exe -Scope CurrentUser -Force
}

Write-Host "Importando módulo ps2exe..."
Import-Module ps2exe

Write-Host "Construyendo start-all.exe..."
Invoke-ps2exe -inputFile ".\start-all.ps1" -outputFile ".\start-all.exe" -noConsole -title "Inventario Ferremolina" -company "Ferremolina" -version "1.0.0.0"

Write-Host "¡Ejecutable creado exitosamente!" -ForegroundColor Green
