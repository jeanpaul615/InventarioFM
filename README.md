# InventarioFM - Sistema de Gestión de Inventario y Facturación

Sistema completo de gestión de inventario, facturación y cotizaciones para Distribuciones Ferremolina.

## 📋 Requisitos Previos

Antes de clonar e instalar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (viene incluido con Node.js)
- **Git** - [Descargar](https://git-scm.com/)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jeanpaul615/InventarioFM.git
cd InventarioFM
```

### 2. Instalar dependencias del Backend

```bash
cd backend
npm install
cd ..
```

### 3. Instalar dependencias del Frontend

```bash
cd front
npm install
cd ..
```

## 🔧 Configuración

### Backend

El backend usa SQLite, por lo que **NO necesitas configurar una base de datos externa**. La base de datos se creará automáticamente al iniciar el servidor.

### Crear usuario administrador

Antes de usar el sistema por primera vez, ejecuta:

```bash
cd backend
npm run seed-admin
cd ..
```

Esto creará el usuario administrador con las siguientes credenciales:
- **Usuario:** CRISTIAN BRAN
- **Contraseña:** 12345

## ▶️ Iniciar el Proyecto

### Opción 1: Iniciar Backend y Frontend por separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd front
npm run dev
```

### Opción 2: Usar el script de inicio (Windows)

Si estás en Windows, puedes usar el script PowerShell que inicia ambos servicios automáticamente:

```powershell
.\start-all.ps1
```

O usar el ejecutable (si existe):
```powershell
.\start-all.exe
```

## 🌐 Acceso al Sistema

Una vez iniciados los servicios:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000

### Credenciales de acceso inicial:
- **Usuario:** CRISTIAN BRAN
- **Contraseña:** 12345

## 📱 Acceso desde otros dispositivos en la red

El sistema está configurado para funcionar en red local. Para acceder desde otro dispositivo:

1. Encuentra tu IP local en la PC servidor:
   ```powershell
   ipconfig
   ```
   Busca la dirección IPv4 (ejemplo: 192.168.0.105)

2. Desde otro dispositivo en la misma red, accede a:
   ```
   http://[TU-IP]:3000
   ```

3. Asegúrate de que el Firewall de Windows permita las conexiones en los puertos 3000 y 8000.

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para manejo de base de datos
- **SQLite** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

### Frontend
- **Next.js 15** - Framework de React
- **React 19** - Librería UI
- **Material-UI (MUI)** - Componentes UI
- **Axios** - Cliente HTTP
- **jsPDF + html2canvas** - Generación de PDFs
- **TypeScript** - Tipado estático

## 📁 Estructura del Proyecto

```
InventarioFM/
├── backend/              # Servidor NestJS
│   ├── src/
│   │   ├── controllers/  # Controladores de API
│   │   ├── entities/     # Modelos de base de datos
│   │   ├── services/     # Lógica de negocio
│   │   ├── guards/       # Protección de rutas
│   │   └── strategies/   # Estrategias de autenticación
│   ├── database.sqlite   # Base de datos (se crea automáticamente)
│   └── package.json
├── front/                # Aplicación Next.js
│   ├── src/
│   │   └── app/
│   │       ├── billing/     # Módulo de facturación
│   │       ├── quotation/   # Módulo de cotizaciones
│   │       ├── customer/    # Gestión de clientes
│   │       ├── components/  # Componentes reutilizables
│   │       └── context/     # Contextos de React (API, Auth)
│   └── package.json
└── start-all.ps1        # Script de inicio automático

```

## 🔑 Funcionalidades Principales

### Gestión de Productos
- ✅ Crear, editar y eliminar productos
- ✅ Control de stock en tiempo real
- ✅ Múltiples listas de precios (lista_1, lista_2, lista_3)
- ✅ Registro de entradas al inventario

### Facturación
- ✅ Crear facturas con múltiples productos
- ✅ Asociar clientes a facturas
- ✅ Generar PDF de facturas (formato profesional)
- ✅ Listado y búsqueda de facturas
- ✅ Descuento automático de stock al finalizar factura

### Cotizaciones
- ✅ Crear cotizaciones sin afectar inventario
- ✅ Generar PDF de cotizaciones (formato diferenciado)
- ✅ Listado y búsqueda de cotizaciones
- ✅ Conversión de cotizaciones a facturas

### Gestión de Clientes
- ✅ Crear y editar clientes
- ✅ Asignar caracterizaciones (listas de precios)
- ✅ Almacenar datos completos (NIT, teléfono, dirección)

### Registro de Inventario
- ✅ Historial completo de movimientos
- ✅ Registro de usuario y fecha
- ✅ Tipos de movimiento (nuevo producto, suma de stock)

### Seguridad
- ✅ Autenticación con JWT
- ✅ Protección de rutas
- ✅ Encriptación de contraseñas
- ✅ Sesiones persistentes

### Características Especiales
- 📱 **Responsive Design**: Funciona en PC, tablet y móvil
- 🖨️ **PDFs Profesionales**: Formato PC incluso desde dispositivos móviles
- 🌐 **Acceso en Red**: Múltiples dispositivos simultáneos
- 💾 **Sin configuración de BD**: SQLite integrado
- 🔄 **Actualización en tiempo real**: Sincronización automática

## 🐛 Solución de Problemas

### El backend no inicia
- Verifica que Node.js esté instalado: `node --version`
- Verifica que las dependencias estén instaladas: `cd backend && npm install`
- Elimina `node_modules` y vuelve a instalar: `rm -rf node_modules && npm install`

### El frontend no inicia
- Verifica que las dependencias estén instaladas: `cd front && npm install`
- Limpia el caché de Next.js: `cd front && rm -rf .next && npm run dev`

### No puedo acceder desde otro dispositivo
- Verifica que ambos dispositivos estén en la misma red
- Verifica que el Firewall permita las conexiones en los puertos 3000 y 8000
- Usa la IP correcta de la PC servidor (no uses localhost desde otro dispositivo)

### Error de autenticación
- Verifica que el backend esté corriendo en el puerto 8000
- Asegúrate de haber creado el usuario administrador con `npm run seed-admin`
- Limpia el localStorage del navegador y vuelve a iniciar sesión

### Los PDFs no se generan correctamente
- Verifica que tengas conexión a internet (se cargan fuentes de Google)
- Asegúrate de que el elemento con id "invoice" o "quotation-invoice" exista en el DOM

## 📝 Scripts Disponibles

### Backend
```bash
npm run start:dev    # Iniciar en modo desarrollo
npm run build        # Compilar para producción
npm run seed-admin   # Crear usuario administrador
npm run clean-db     # Limpiar base de datos (¡CUIDADO!)
```

### Frontend
```bash
npm run dev          # Iniciar en modo desarrollo
npm run build        # Compilar para producción
npm run start        # Iniciar versión de producción
npm run lint         # Verificar código
```

## 🔐 Seguridad en Producción

Si vas a usar este sistema en producción, considera:

1. Cambiar las credenciales del administrador
2. Usar variables de entorno para configuraciones sensibles
3. Configurar HTTPS
4. Implementar rate limiting
5. Usar una base de datos más robusta que SQLite
6. Configurar backups automáticos

## 📄 Licencia

Este proyecto es privado y pertenece a Distribuciones Ferremolina.

## 👨‍💻 Desarrollador

Jean Paul - jeanpaul615

---

**¿Necesitas ayuda?** Contacta al desarrollador o revisa la documentación en el código fuente.
