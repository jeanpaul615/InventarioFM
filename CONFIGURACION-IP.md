# 🔧 Configuración de IP del Servidor

## Cambiar la IP del servidor

Para cambiar la IP donde se ejecuta el programa, edita el archivo **`config.ps1`** en la raíz del proyecto:

```powershell
# Cambia esta línea con tu IP local
$SERVIDOR_IP = "172.20.10.4"  # <-- EDITA AQUÍ
```

### Opción 1: Actualización Manual
1. Abre `config.ps1`
2. Cambia el valor de `$SERVIDOR_IP` con tu IP
3. Ejecuta `.\start-all.ps1` para iniciar el sistema

### Opción 2: Actualización Automática
1. Edita `config.ps1` con tu nueva IP
2. Ejecuta `.\update-config.ps1` para actualizar todos los archivos
3. Ejecuta `.\start-all.ps1` para iniciar el sistema

## Archivos de configuración

- **`config.ps1`**: Configuración principal (edita aquí)
- **`backend\.env`**: Variables de entorno del backend
- **`front\.env.local`**: Variables de entorno del frontend

## Nota
Los archivos `.env` se actualizan automáticamente al ejecutar `update-config.ps1` o al iniciar el sistema.
