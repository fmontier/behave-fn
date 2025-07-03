# BDD Requirements Management - Frontend

Frontend en React para el sistema de gestión de requerimientos BDD (Behavior Driven Development).

## Características

- **React 18** con Vite como build tool
- **TailwindCSS** para estilos
- **React Router** para navegación
- **Axios** para llamadas a la API
- **Socket.IO** para actualizaciones en tiempo real
- **React Hot Toast** para notificaciones
- **Recharts** para visualizaciones
- **@hello-pangea/dnd** para drag & drop
- **JWT Authentication** integrada

## Despliegue

### Netlify

1. **Conectar repositorio:**
   - Fork o sube el código a GitHub/GitLab
   - Conecta tu repositorio en Netlify

2. **Configurar variables de entorno:**
   ```
   VITE_API_BASE_URL=https://your-backend-app.herokuapp.com
   ```

3. **Configuración automática:**
   - Netlify detectará automáticamente el `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel

1. **Conectar repositorio:**
   - Importa tu proyecto desde GitHub/GitLab

2. **Configurar variables de entorno:**
   ```
   VITE_API_BASE_URL=https://your-backend-app.herokuapp.com
   ```

3. **Deploy automático:**
   - Vercel usará la configuración en `vercel.json`

### Build Manual

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu backend

# Build para producción
npm run build

# Los archivos estarán en la carpeta 'dist'
```

## Configuración Local

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con la URL del backend local
VITE_API_BASE_URL=http://localhost:8000
```

3. **Ejecutar en desarrollo:**
```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter ESLint

## Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
│   ├── auth/          # Componentes de autenticación
│   ├── dashboard/     # Dashboard y analytics
│   ├── features/      # Gestión de features
│   ├── kanban/        # Tablero Kanban
│   └── layout/        # Layout y navegación
├── contexts/          # Contextos de React
├── hooks/             # Custom hooks
├── pages/             # Páginas principales
├── services/          # Servicios y API
└── utils/             # Utilidades
```

## Funcionalidades

### Autenticación
- Login/Registro de usuarios
- JWT tokens con renovación automática
- Rutas protegidas

### Gestión de Proyectos
- CRUD completo de proyectos
- Selección de contexto de proyecto
- Dashboard con estadísticas

### Features y Escenarios
- Tablero Kanban drag & drop
- Editor de features BDD
- Gestión de escenarios Given/When/Then
- Estados de feature (backlog, progress, testing, done)

### Analytics
- Dashboard con métricas
- Vista global y por proyecto
- Analytics temporales
- Visualizaciones con gráficos

### Testing
- Ejecución de tests BDD simulados
- Resultados en tiempo real
- Integración con Behave

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base del backend API | `https://api.example.com` |
| `VITE_APP_NAME` | Nombre de la aplicación | `BDD Requirements` |
| `VITE_APP_VERSION` | Versión de la aplicación | `1.0.0` |

## Licencia

MIT License