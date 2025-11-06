# Configuración de Red - Inventario Ferremolina

## Información de la Red

**IP del Servidor:** 192.168.0.105

## URLs de Acceso

### Desde el mismo equipo (localhost):
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Desde otros dispositivos en la red:
- Frontend: http://192.168.0.105:3000
- Backend: http://192.168.0.105:8000

## Instrucciones para acceder desde otro dispositivo

1. Asegúrate de que ambos dispositivos estén en la misma red WiFi
2. Ejecuta el proyecto con `.\start-all.exe` o `.\start-all.ps1`
3. Desde el otro dispositivo, abre el navegador y ve a: http://192.168.0.105:3000

## Firewall de Windows

Si no puedes acceder desde otro dispositivo, es posible que necesites permitir las conexiones en el firewall:

### Permitir Node.js en el Firewall:
```powershell
# Ejecutar como Administrador
New-NetFirewallRule -DisplayName "Node.js Frontend (Port 3000)" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
New-NetFirewallRule -DisplayName "Node.js Backend (Port 8000)" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow
```

## Credenciales de Acceso

- **Usuario:** CRISTIAN BRAN
- **Contraseña:** 12345

## Verificar tu IP actual

Para verificar la IP actual de tu computadora, ejecuta en PowerShell:
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}
```

Si la IP cambió, actualiza:
1. `front/src/app/context/ApiContext.tsx` - línea con `baseUrl`
2. Este archivo README-NETWORK.md
