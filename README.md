# TimeBudget

Gestiona tu tiempo como un presupuesto financiero.

## Quick Start con Docker

```bash
# 1. Clonar y entrar al directorio
cd TimeBudget

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Editar .env con tus valores (especialmente JWT_SECRET y DB_PASSWORD)

# 4. Iniciar todos los servicios
docker-compose up -d

# 5. Ejecutar migraciones de base de datos
docker-compose exec backend npx prisma db push

# 6. Abrir en el navegador
open http://localhost
```

## Desarrollo Local

### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar cliente Prisma
npm run db:generate

# Crear tablas en la base de datos
npm run db:push

# Iniciar en modo desarrollo
npm run dev
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

## Stack Tecnológico

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication
- Clean Architecture

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- React Router
- Recharts

## Estructura del Proyecto

```
TimeBudget/
├── backend/
│   ├── src/
│   │   ├── domain/          # Entidades, value objects, interfaces
│   │   ├── application/     # Casos de uso, DTOs
│   │   ├── infrastructure/  # Prisma, repositorios, servicios
│   │   └── presentation/    # Controllers, routes, middlewares
│   └── prisma/
│       └── schema.prisma
├── frontend/
│   ├── src/
│   │   ├── services/        # API client
│   │   ├── store/           # Zustand stores
│   │   ├── shared/          # Types, utils, components
│   │   └── ui/
│   │       ├── layouts/
│   │       └── pages/
│   └── public/
└── docker-compose.yml
```

## Scripts Disponibles

### Backend
- `npm run dev` - Desarrollo con hot-reload
- `npm run build` - Compilar TypeScript
- `npm run start` - Producción
- `npm run db:studio` - Abrir Prisma Studio

### Frontend
- `npm run dev` - Desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
