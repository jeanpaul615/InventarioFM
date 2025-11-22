# Script para actualizar las IPs en todos los archivos de configuración
# Ejecuta este script después de cambiar la IP en config.ps1

# Cargar configuración
. "$PSScriptRoot\config.ps1"

Write-Host "Actualizando archivos de configuración..." -ForegroundColor Cyan

# Actualizar backend/.env
$backendEnv = @"
# Configuración del Backend
PORT=$BACKEND_PORT

# JWT Secret (cambia esto en producción)
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui

# IP del servidor
SERVER_IP=$SERVIDOR_IP
"@

$backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8
Write-Host "✓ Actualizado backend\.env" -ForegroundColor Green

# Actualizar front/.env.local
$frontendEnv = @"
# Configuración del Frontend
# Esta IP se actualiza automáticamente desde config.ps1
NEXT_PUBLIC_API_URL=$BACKEND_URL
"@

$frontendEnv | Out-File -FilePath "front\.env.local" -Encoding UTF8
Write-Host "✓ Actualizado front\.env.local" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Configuración actualizada exitosamente!" -ForegroundColor Green
Write-Host "Backend URL:  $BACKEND_URL" -ForegroundColor Yellow
Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
