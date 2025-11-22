# ======================================
# CONFIGURACIÓN CENTRALIZADA DEL SISTEMA
# ======================================
# Cambia aquí la IP de tu servidor para todo el sistema

# IP del servidor (cambia esto según tu red)
$SERVIDOR_IP = "172.20.10.4"

# Puertos (generalmente no necesitas cambiarlos)
$BACKEND_PORT = 8000
$FRONTEND_PORT = 3000

# URLs completas (se generan automáticamente)
$BACKEND_URL = "http://${SERVIDOR_IP}:${BACKEND_PORT}"
$FRONTEND_URL = "http://${SERVIDOR_IP}:${FRONTEND_PORT}"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   CONFIGURACIÓN DEL SISTEMA" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "IP del Servidor: $SERVIDOR_IP" -ForegroundColor Yellow
Write-Host "Backend URL:     $BACKEND_URL" -ForegroundColor Green
Write-Host "Frontend URL:    $FRONTEND_URL" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Exportar variables para que otros scripts las usen
$env:SERVIDOR_IP = $SERVIDOR_IP
$env:BACKEND_PORT = $BACKEND_PORT
$env:FRONTEND_PORT = $FRONTEND_PORT
$env:BACKEND_URL = $BACKEND_URL
$env:FRONTEND_URL = $FRONTEND_URL
