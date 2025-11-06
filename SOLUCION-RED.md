# 🔧 Solución: Acceso desde Red Local

## ⚠️ Problema: ERR_BLOCKED_BY_CLIENT

Este error ocurre cuando:
1. **Un bloqueador de anuncios** está bloqueando la conexión al backend
2. **Una extensión del navegador** está interfiriendo
3. **El antivirus** está bloqueando la conexión

## ✅ Soluciones

### 1. Desactivar Bloqueador de Anuncios
- **AdBlock, uBlock Origin, AdGuard**: Desactívalo para `192.168.0.105`
- Agrega `192.168.0.105` a la lista blanca
- O desactiva temporalmente para probar

### 2. Modo Incógnito / Privado
- Prueba abrir el navegador en modo incógnito
- Esto desactiva la mayoría de extensiones

### 3. Desde el Celular

#### En Chrome/Edge (Android):
1. Abre Chrome
2. Ve a: `http://192.168.0.105:3000`
3. Si te sale error de bloqueador, ve a:
   - Menú (⋮) → Configuración → Configuración de sitios
   - Busca `192.168.0.105`
   - Permitir JavaScript y contenido

#### En Safari (iOS):
1. Abre Safari
2. Ve a: `http://192.168.0.105:3000`
3. Safari no debería bloquear conexiones locales

### 4. Verificar Firewall
Si aún no funciona, ejecuta en PowerShell (como Administrador):

```powershell
# Permitir puertos en el firewall
New-NetFirewallRule -DisplayName "Inventario FM - Frontend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private,Domain
New-NetFirewallRule -DisplayName "Inventario FM - Backend" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow -Profile Private,Domain
```

### 5. Probar la Conexión

**Archivo de prueba:**
```
http://192.168.0.105:3000/test-connection.html
```

**Backend directo:**
```
http://192.168.0.105:8000
```

Si este último funciona en el navegador pero no en la app, el problema es el bloqueador.

## 🚀 Reiniciar Servicios

```powershell
.\restart-services.ps1
```

O usa el ejecutable:
```powershell
.\start-all.exe
```

## 📱 Credenciales

- **Usuario**: CRISTIAN BRAN
- **Contraseña**: 12345

## 🔍 Diagnóstico

Si sigue sin funcionar, verifica:

1. **Backend corriendo:**
   ```powershell
   Test-NetConnection -ComputerName 192.168.0.105 -Port 8000
   ```

2. **Frontend corriendo:**
   ```powershell
   Test-NetConnection -ComputerName 192.168.0.105 -Port 3000
   ```

3. **Consola del navegador:**
   - F12 → Pestaña Console
   - Busca errores específicos

## 💡 Recomendaciones

- **Desactiva bloqueadores de anuncios** para IPs locales
- **Usa la app en modo incógnito** si tienes muchas extensiones
- **Asegúrate** de estar en el mismo WiFi
