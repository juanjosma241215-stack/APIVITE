# Apivite

Aplicación web construida con React + Vite en el frontend y Express + MongoDB en el backend. El proyecto combina una interfaz inspirada en Rick and Morty con autenticación simulada en el cliente, dashboard administrativo, consumo de API externa y una base lista para CRUD de tareas en el servidor.

## Tabla de contenido

- [Descripción general](#descripción-general)
- [Características principales](#características-principales)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración del entorno](#configuración-del-entorno)
- [Ejecución del proyecto](#ejecución-del-proyecto)
- [Scripts disponibles](#scripts-disponibles)
- [Flujo de la aplicación](#flujo-de-la-aplicación)
- [API del backend](#api-del-backend)
- [Estado actual del proyecto](#estado-actual-del-proyecto)
- [Mejoras recomendadas](#mejoras-recomendadas)

## Descripción general

`Apivite` es una aplicación full stack dividida en dos partes:

- Un `frontend` en React que muestra una landing visual, autenticación, dashboard y consumo de la API pública de Rick and Morty.
- Un `backend` en Express preparado para manejar tareas (`tasks`) mediante un CRUD conectado a MongoDB.

Actualmente, el flujo de autenticación del frontend está simulado con `localStorage`, lo que permite navegar y probar la interfaz sin depender todavía de autenticación real del backend.

## Características principales

- Landing page con diseño temático y responsive.
- Pantalla de autenticación con:
  - inicio de sesión
  - registro
  - recuperación visual de acceso
- Sesión simulada en frontend con persistencia en `localStorage`.
- Dashboard privado con protección de rutas.
- Vista de monitoreo con búsqueda local de personajes.
- Consumo de la [Rick and Morty API](https://rickandmortyapi.com/).
- Visualización de estadísticas con `Chart.js`.
- Backend con Express y estructura modular.
- CRUD base para tareas usando `MongoDB` y `Mongoose`.

## Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Bootstrap
- Bootstrap Icons
- Chart.js
- react-chartjs-2
- vite-plugin-pwa

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- Morgan
- Dotenv

## Estructura del proyecto

```text
Apivite/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ db.js
│  │  ├─ controllers/
│  │  │  └─ taskController.js
│  │  ├─ middlewares/
│  │  │  └─ errorMiddleware.js
│  │  ├─ models/
│  │  │  └─ Task.js
│  │  ├─ routes/
│  │  │  └─ taskRoutes.js
│  │  └─ app.js
│  ├─ .env
│  ├─ index.js
│  └─ package.json
├─ public/
├─ src/
│  ├─ features/
│  │  └─ auth/
│  │     ├─ api/
│  │     │  └─ components/
│  │     │     └─ ApiRyC_Axios.jsx
│  │     ├─ dashboard/
│  │     │  ├─ components/
│  │     │  ├─ hooks/
│  │     │  └─ pages/
│  │     └─ layout/
│  │        └─ components/
│  ├─ shared/
│  ├─ App.jsx
│  ├─ AppRoutes.jsx
│  └─ main.jsx
├─ package.json
└─ README.md
```

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js 18 o superior
- npm
- MongoDB local o una URI válida de MongoDB Atlas

## Instalación

### 1. Clonar el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd Apivite
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
cd ..
```

## Configuración del entorno

El backend usa un archivo `.env` dentro de `backend/`.

Contenido actual:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/apivite
```

### Variables

- `PORT`: puerto donde corre el backend.
- `FRONTEND_URL`: origen permitido por CORS para el frontend.
- `MONGODB_URI`: cadena de conexión a MongoDB.

## Ejecución del proyecto

### Ejecutar frontend

Desde la raíz del proyecto:

```bash
npm run dev
```

Por defecto abre en:

```text
http://localhost:5173
```

### Ejecutar backend

Desde la carpeta `backend`:

```bash
npm run dev
```

Por defecto corre en:

```text
http://localhost:4000
```

## Scripts disponibles

### Frontend

```bash
npm run dev
```

Inicia el servidor de desarrollo con Vite.

```bash
npm run build
```

Genera la build de producción.

```bash
npm run preview
```

Previsualiza la build generada.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

### Backend

```bash
npm run dev
```

Levanta el backend con recarga usando `node --watch`.

```bash
npm start
```

Levanta el backend en modo normal.

## Flujo de la aplicación

### Frontend

1. El usuario entra a la landing (`/`).
2. Desde el header o el flujo visual entra a `login`.
3. Al iniciar sesión o registrarse:
   - se guarda `auth=true` en `localStorage`
   - se guarda el nombre visible del usuario
   - se redirige a `/admin`
4. La ruta `/admin` está protegida por `ProtectedRoute`.
5. Si no existe sesión, cualquier intento de entrar al dashboard redirige a `/login`.

### Dashboard

El dashboard tiene tres áreas principales:

- `Monitor`: muestra métricas, buscador y personajes.
- `Dimensiones`: lista ubicaciones de la API pública.
- `Protocolos`: muestra paneles ficticios de seguridad.

### Sesión actual

La autenticación actual es visual y local. No valida usuarios contra base de datos ni tokens reales.

## API del backend

El backend expone una API base para tareas.

### Ruta de prueba

```http
GET /
```

Respuesta esperada:

```json
{
  "message": "API de Apivite funcionando",
  "status": "ok"
}
```

### Endpoints de tareas

#### Obtener tareas

```http
GET /api/tasks
```

#### Crear tarea

```http
POST /api/tasks
Content-Type: application/json
```

Body:

```json
{
  "title": "Nueva tarea",
  "description": "Descripcion opcional",
  "completed": false
}
```

#### Actualizar tarea

```http
PUT /api/tasks/:id
Content-Type: application/json
```

#### Eliminar tarea

```http
DELETE /api/tasks/:id
```

## Estado actual del proyecto

### Ya implementado

- Diseño frontend responsive
- Login y registro visuales
- Dashboard protegido por sesión local
- Consumo de API externa
- Base del backend con Express
- Estructura CRUD para tareas
- Comentarios explicativos en el código principal

### Pendiente o simulado

- Autenticación real con backend
- Registro persistente de usuarios
- Login con JWT o sesiones reales
- Conexión del frontend con el CRUD de tareas
- Manejo completo de errores del lado cliente

## Mejoras recomendadas


- Reemplazar `localStorage` por autenticación real con JWT.
- Crear colección de usuarios en MongoDB.
- Conectar formularios de login y registro al backend.
- Agregar validaciones con librerías como `zod` o `yup`.
- Incorporar estado global para sesión y usuario.
- Añadir pruebas para frontend y backend.
- Configurar despliegue en servicios como Vercel y Render.

---

Si vas a seguir evolucionando este proyecto, una buena siguiente fase sería conectar el `Login` y el `Register` con el backend para pasar de una demo visual a una autenticación real completa.
