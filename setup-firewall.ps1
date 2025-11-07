# Script para configurar el Firewall de Windows
# DEBE ejecutarse como Administrador

# Verificar privilegios de administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: Este script debe ejecutarse como Administrador" -ForegroundColor Red
    Write-Host ""
    Write-Host "Haz clic derecho en el archivo y selecciona 'Ejecutar como administrador'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Presiona cualquier tecla para salir..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Configuración de Firewall" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Eliminar reglas existentes si existen
Write-Host "🗑️  Limpiando reglas anteriores..." -ForegroundColor Yellow
Remove-NetFirewallRule -DisplayName "InventarioFM Frontend (3000)" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "InventarioFM Backend (8000)" -ErrorAction SilentlyContinue

# Crear regla para el puerto 3000 (Frontend)
Write-Host "📝 Creando regla para puerto 3000 (Frontend)..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "InventarioFM Frontend (3000)" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 3000 `
    -Action Allow `
    -Profile Any `
    -Description "Permite acceso al frontend de InventarioFM desde la red local"

Write-Host "   ✓ Regla creada para puerto 3000" -ForegroundColor Green

# Crear regla para el puerto 8000 (Backend)
Write-Host "📝 Creando regla para puerto 8000 (Backend)..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "InventarioFM Backend (8000)" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 8000 `
    -Action Allow `
    -Profile Any `
    -Description "Permite acceso al backend de InventarioFM desde la red local"

Write-Host "   ✓ Regla creada para puerto 8000" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Firewall configurado correctamente" -ForegroundColor Green
Write-Host ""
Write-Host "Los puertos 3000 y 8000 ahora están abiertos para la red local" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
