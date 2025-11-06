# Script para reiniciar los servicios del proyecto

Write-Host "Deteniendo procesos existentes..." -ForegroundColor Yellow

# Detener procesos en puerto 3000
$proc3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Where-Object {$_.State -eq "Listen"}
if ($proc3000) {
    $pids3000 = $proc3000.OwningProcess | Select-Object -Unique
    foreach ($processId in $pids3000) {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Proceso en puerto 3000 detenido (PID: $processId)" -ForegroundColor Green
    }
}

# Detener procesos en puerto 8000
$proc8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Where-Object {$_.State -eq "Listen"}
if ($proc8000) {
    $pids8000 = $proc8000.OwningProcess | Select-Object -Unique
    foreach ($processId in $pids8000) {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Proceso en puerto 8000 detenido (PID: $processId)" -ForegroundColor Green
    }
}

Start-Sleep -Seconds 2

Write-Host "`nIniciando servicios..." -ForegroundColor Cyan

Write-Host "Iniciando Frontend en 0.0.0.0:3000..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd front; npm run dev'

Write-Host "Iniciando Backend en 0.0.0.0:8000..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd backend; npm run start:dev'

Write-Host "" -ForegroundColor Green
Write-Host "Servicios iniciados correctamente!" -ForegroundColor Green
Write-Host "Acceso local: http://localhost:3000" -ForegroundColor White
Write-Host "Acceso red: http://192.168.0.105:3000" -ForegroundColor Yellow

Start-Sleep -Seconds 3
$url = "http://192.168.0.105:3000"
Start-Process $url
