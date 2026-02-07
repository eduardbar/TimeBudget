# ⏳ TimeBudget: Time Management with Financial Discipline

![TimeBudget Preview](frontend/public/og-image.svg)

**TimeBudget** is an enterprise-level time management platform designed for individuals and organizations that want to treat their hours with the same rigor as their finances. Unlike conventional calendars and to-do lists, TimeBudget applies the **Zero-Based Budgeting** methodology to your time: every minute receives a purpose before the day begins.

## 🚀 Key Features

- 💰 **Zero-Based Budgeting**: Allocate each of your 1,440 daily minutes to specific categories before the day starts.
- 🗑️ **Radical Elimination**: Identify and eliminate low-value activities. Visualize how much time you recover by saying "no".
- 📊 **Real-Time Analytics**: Compare your planned budget vs. actual time invested with interactive charts.
- 🎯 **Priority System**: Define what truly matters and ensure it has guaranteed time.
- 🔐 **Secure Authentication**: Login system with JWT (JSON Web Tokens) and route protection.
- 📅 **Calendar View**: Visualize your activities and work sessions in an interactive calendar.
- 🎨 **Modern UI**: Elegant and responsive interface built with TailwindCSS.

## 🛠️ Tech Stack

| Layer | Technologies |
|------|-------------|
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, Zustand |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | JWT (JSON Web Tokens), bcrypt |
| **Testing** | Vitest, Testing Library |
| **Infrastructure** | Docker, Docker Compose |

## ⚙️ Environment Setup

Create a `.env` file in the `backend/` folder with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/timebudget"

# Authentication
JWT_SECRET=your_super_secure_secret
JWT_EXPIRES_IN=7d

NODE_ENV=development
PORT=3000
```

## 📦 Installation and Deployment

### 1. Clone the repository

```bash
git clone https://github.com/eduardbar/TimeBudget.git
cd TimeBudget
```

### 2. Install dependencies

Install backend and frontend dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Setup database

```bash
cd backend
npx prisma db push
npx prisma generate
```

### 4. Local Development

To run both servers simultaneously:

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

- Frontend available at: `http://localhost:5173`
- Backend API at: `http://localhost:3000`

### 5. Docker (Production)

To start the entire environment with Docker:

```bash
docker-compose up --build
```

## 📂 Project Structure

```
TimeBudget/
├── backend/                  # REST API Express + TypeScript
│   ├── src/
│   │   ├── domain/           # Entities, interfaces, errors
│   │   ├── application/      # Use cases, DTOs
│   │   ├── infrastructure/   # Database, external services
│   │   └── presentation/     # Controllers, routes, middlewares
│   ├── prisma/               # Schema and DB migrations
│   └── tests/                # Unit and integration tests
├── frontend/                 # SPA React + Vite
│   ├── src/
│   │   ├── ui/               # Pages and layouts
│   │   ├── shared/           # Reusable components
│   │   ├── store/            # Global state (Zustand)
│   │   └── services/         # API client
│   └── tests/                # Component tests
└── docker-compose.yml
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register new user |
| `POST` | `/login` | Login (returns JWT) |
| `GET` | `/me` | Get authenticated user |

### Time Budgets (`/api/time-budgets`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create new weekly budget |
| `GET` | `/current` | Get current week's budget |
| `PUT` | `/:id` | Update existing budget |

### Activities (`/api/activities`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Register new activity |
| `GET` | `/` | List user activities |
| `DELETE` | `/:id` | Delete activity |

## 🧪 Testing

We use **Vitest** for unit and integration testing:

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# Tests with coverage
npm run test:coverage
```

## 🏗️ Architecture

TimeBudget follows **Clean Architecture** principles:

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

- **Domain**: Pure entities and business logic (no external dependencies).
- **Application**: Use cases and orchestration.
- **Infrastructure**: Repository implementation, external services.
- **Presentation**: REST controllers and HTTP routes.

---

<div align="center">
  <sub>Developed with ❤️ by Eduard Barrera</sub>
</div>
