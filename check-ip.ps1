# Script para verificar la IP actual y la configuración del proyecto

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Verificación de Configuración" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Obtener la IP local
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress

Write-Host "📍 Tu IP actual es: $ipAddress" -ForegroundColor Green
Write-Host ""

# IP configurada en el proyecto
$configuredIP = "172.20.10.4"

Write-Host "⚙️  IP configurada en el proyecto: $configuredIP" -ForegroundColor Yellow
Write-Host ""

if ($ipAddress -eq $configuredIP) {
    Write-Host "✅ CORRECTO: La IP coincide con la configuración del proyecto" -ForegroundColor Green
} else {
    Write-Host "⚠️  ADVERTENCIA: La IP actual ($ipAddress) NO coincide con la configurada ($configuredIP)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Si quieres actualizar el proyecto para usar tu IP actual, ejecuta:" -ForegroundColor Yellow
    Write-Host "   (Requiere actualizar manualmente los archivos de configuración)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📁 Archivos con configuración de IP:" -ForegroundColor Cyan
Write-Host "   - front\src\config\api.ts" -ForegroundColor White
Write-Host "   - front\src\app\context\ApiContext.tsx" -ForegroundColor White
Write-Host "   - start-all.ps1" -ForegroundColor White
Write-Host "   - restart-services.ps1" -ForegroundColor White
Write-Host "   - test-connection.html" -ForegroundColor White
Write-Host "   - .env.example" -ForegroundColor White
Write-Host "   - README.md" -ForegroundColor White
Write-Host ""

Write-Host "🌐 URLs de acceso:" -ForegroundColor Cyan
Write-Host "   Frontend: http://$configuredIP:3000" -ForegroundColor White
Write-Host "   Backend:  http://$configuredIP:8000" -ForegroundColor White
Write-Host ""

Write-Host "🔥 Reglas de Firewall necesarias:" -ForegroundColor Cyan
Write-Host "   - Puerto 3000 (TCP Entrante)" -ForegroundColor White
Write-Host "   - Puerto 8000 (TCP Entrante)" -ForegroundColor White
Write-Host ""

# Verificar si los puertos están abiertos en el firewall
Write-Host "🔍 Verificando reglas de Firewall..." -ForegroundColor Yellow
$rules3000 = Get-NetFirewallRule -DisplayName "*3000*" -ErrorAction SilentlyContinue
$rules8000 = Get-NetFirewallRule -DisplayName "*8000*" -ErrorAction SilentlyContinue

if ($rules3000) {
    Write-Host "   ✓ Puerto 3000: Regla encontrada" -ForegroundColor Green
} else {
    Write-Host "   ✗ Puerto 3000: Sin regla de firewall" -ForegroundColor Red
}

if ($rules8000) {
    Write-Host "   ✓ Puerto 8000: Regla encontrada" -ForegroundColor Green
} else {
    Write-Host "   ✗ Puerto 8000: Sin regla de firewall" -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
