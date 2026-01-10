# ⏳ TimeBudget: Gestión del Tiempo con Mentalidad Financiera

![TimeBudget Preview](frontend/public/og-image.svg)

**TimeBudget** es una plataforma de gestión del tiempo de nivel empresarial, diseñada para personas y organizaciones que quieren tratar sus horas con el mismo rigor que sus finanzas. A diferencia de los calendarios y to-do lists convencionales, TimeBudget aplica el método de **Presupuesto Base Cero** a tu tiempo: cada minuto recibe un propósito antes de que empiece el día.

## 🚀 Características Principales

- 💰 **Presupuesto Base Cero**: Asigna cada uno de tus 1440 minutos diarios a categorías específicas antes de que comience la jornada.
- 🗑️ **Eliminación Radical**: Identifica y elimina actividades de bajo valor. Visualiza cuánto tiempo recuperas al decir "no".
- 📊 **Analytics en Tiempo Real**: Compara tu presupuesto planificado vs. el tiempo real invertido con gráficos interactivos.
- 🎯 **Sistema de Prioridades**: Define qué es realmente importante y asegura que tenga tiempo garantizado.
- 🔐 **Autenticación Segura**: Sistema de login con JWT (JSON Web Tokens) y protección de rutas.
- 📅 **Vista de Calendario**: Visualiza tus actividades y sesiones de trabajo en un calendario interactivo.
- 🎨 **UI Moderna**: Interfaz elegante y responsiva construida con TailwindCSS.

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, Zustand |
| **Backend** | Node.js, Express.js, TypeScript |
| **Base de Datos** | PostgreSQL con Prisma ORM |
| **Autenticación** | JWT (JSON Web Tokens), bcrypt |
| **Testing** | Vitest, Testing Library |
| **Infraestructura** | Docker, Docker Compose |

## ⚙️ Configuración del Entorno

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/timebudget"

# Autenticación
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=7d

NODE_ENV=development
PORT=3000
```

## 📦 Instalación y Despliegue

### 1. Clonar el repositorio

```bash
git clone https://github.com/eduardbar/TimeBudget.git
cd TimeBudget
```

### 2. Instalar dependencias

Instala las dependencias del backend y frontend:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configurar la base de datos

```bash
cd backend
npx prisma db push
npx prisma generate
```

### 4. Desarrollo Local

Para correr ambos servidores simultáneamente:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

- Frontend disponible en: `http://localhost:5173`
- Backend API en: `http://localhost:3000`

### 5. Docker (Producción)

Para levantar todo el entorno con Docker:

```bash
docker-compose up --build
```

## 📂 Estructura del Proyecto

```
TimeBudget/
├── backend/                  # API REST Express + TypeScript
│   ├── src/
│   │   ├── domain/           # Entidades, interfaces, errores
│   │   ├── application/      # Casos de uso, DTOs
│   │   ├── infrastructure/   # Base de datos, servicios externos
│   │   └── presentation/     # Controladores, rutas, middlewares
│   ├── prisma/               # Schema y migraciones DB
│   └── tests/                # Tests unitarios e integración
├── frontend/                 # SPA React + Vite
│   ├── src/
│   │   ├── ui/               # Páginas y layouts
│   │   ├── shared/           # Componentes reutilizables
│   │   ├── store/            # Estado global (Zustand)
│   │   └── services/         # Cliente API
│   └── tests/                # Tests de componentes
└── docker-compose.yml
```

## 📡 API Endpoints

### Autenticación (`/api/auth`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/register` | Registrar nuevo usuario |
| `POST` | `/login` | Iniciar sesión (retorna JWT) |
| `GET` | `/me` | Obtener usuario autenticado |

### Presupuesto de Tiempo (`/api/time-budgets`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/` | Crear nuevo presupuesto semanal |
| `GET` | `/current` | Obtener presupuesto de la semana actual |
| `PUT` | `/:id` | Actualizar presupuesto existente |

### Actividades (`/api/activities`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/` | Registrar nueva actividad |
| `GET` | `/` | Listar actividades del usuario |
| `DELETE` | `/:id` | Eliminar actividad |

## 🧪 Testing

Usamos **Vitest** para pruebas unitarias y de integración:

```bash
# Tests del Backend
cd backend
npm run test

# Tests del Frontend
cd frontend
npm run test

# Tests con cobertura
npm run test:coverage
```

## 🏗️ Arquitectura

TimeBudget sigue los principios de **Clean Architecture**:

```
┌─────────────────────────────────────────────────────┐
│                   Presentation                       │
│              (Controllers, Routes)                   │
├─────────────────────────────────────────────────────┤
│                   Application                        │
│                  (Use Cases)                         │
├─────────────────────────────────────────────────────┤
│                   Domain                             │
│           (Entities, Interfaces)                     │
├─────────────────────────────────────────────────────┤
│                Infrastructure                        │
│            (Database, Services)                      │
└─────────────────────────────────────────────────────┘
```

- **Domain**: Entidades puras y lógica de negocio (sin dependencias externas).
- **Application**: Casos de uso y orquestación.
- **Infrastructure**: Implementación de repositorios, servicios externos.
- **Presentation**: Controladores REST y rutas HTTP.

---

<div align="center">
  <sub>Desarrollado con ❤️ por Eduardo Barboza</sub>
</div>
