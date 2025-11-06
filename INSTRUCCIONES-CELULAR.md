# Instrucciones para Celular 📱

## 🔴 IMPORTANTE: Desactivar Bloqueador

### Android (Chrome/Edge):
1. **Opción A - Desactivar bloqueador:**
   - Abre el navegador
   - Ve a `192.168.0.105:3000`
   - Toca el ícono de escudo 🛡️ o candado 🔒
   - Desactiva "Bloqueador de anuncios"
   - Recarga la página

2. **Opción B - Lista blanca:**
   - Menú (⋮) → Configuración
   - Configuración de sitios
   - JavaScript → Permitir
   - Agregar `192.168.0.105` a permitidos

### iPhone (Safari):
1. Safari no debería bloquear
2. Si tienes apps de bloqueo (AdGuard, etc.):
   - Desactívalas temporalmente
   - O agrega `192.168.0.105` a lista blanca

## ✅ Pasos para Acceder:

1. **Conecta tu celular al mismo WiFi**
2. **Abre el navegador**
3. **Escribe:** `http://192.168.0.105:3000`
4. **Si sale error de conexión:**
   - Desactiva bloqueadores
   - Prueba en modo incógnito
5. **Inicia sesión:**
   - Usuario: `CRISTIAN BRAN`
   - Contraseña: `12345`

## 🔍 Si no funciona:

Prueba primero el backend directamente:
`http://192.168.0.105:8000`

Debería mostrar un JSON con:
```json
{"message": "Hello World!"}
```

Si esto funciona pero la app no, el problema es el bloqueador.
