# ✈️ Apron Management System

A full-stack application for managing airport apron operations, including flight plans, stands, and stand assignments.

## 🏗️ Project Structure

```
apron_management_adbsafegate/
├── backend/                    # NestJS v11 Backend
│   ├── src/
│   │   ├── database/          # TypeORM entities, config, seeds
│   │   └── modules/           # Feature modules (flight-plans, stands, etc.)
│   ├── docker-compose.yml     # PostgreSQL configuration
│   └── package.json
├── frontend/                   # Angular v17+ Frontend
│   ├── src/
│   │   └── app/
│   │       ├── components/    # Standalone components
│   │       ├── services/      # API services
│   │       └── models/        # TypeScript interfaces
│   └── package.json
├── data/                       # JSON seed data
│   ├── flightplans.json       # Flight plan data
│   └── stands.json            # Stand data
├── setup.bat                   # Windows setup script
├── setup.sh                    # Unix setup script
└── README.md                   # This file
```

## 🛠️ Tech Stack

### Backend
- **NestJS v11** - Progressive Node.js framework
- **TypeORM** - ORM for database management
- **PostgreSQL 16** - Relational database (via Docker)
- **JWT/Passport** - Authentication
- **class-validator** - DTO validation

### Frontend
- **Angular 17+** - Frontend framework
- **Standalone Components** - Modern Angular architecture
- **Signals** - Reactive state management
- **HttpClient** - API communication

## 📋 Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org)
- **npm** - Comes with Node.js
- **Docker & Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)

## 🚀 Quick Start

### Option 1: Using Setup Scripts

**Windows:**
```batch
setup.bat
```

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

#### 1. Start PostgreSQL Database

```bash
cd backend
docker-compose up -d
```

This starts PostgreSQL on port `5432` with:
- **Database:** apron_management
- **User:** postgres
- **Password:** postgres

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start in development mode (seeds automatically on startup)
npm run start:dev
```

The backend runs on **http://localhost:3000**

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend runs on **http://localhost:4200**

## 📦 Available Commands

### Backend Commands (run from `/backend`)

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start backend in watch mode |
| `npm run start:prod` | Start production server |
| `npm run build` | Build for production |
| `npm run seed` | Manually run database seeding |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage |
| `docker-compose up -d` | Start PostgreSQL |
| `docker-compose down` | Stop PostgreSQL |

### Frontend Commands (run from `/frontend`)

| Command | Description |
|---------|-------------|
| `npm start` | Start Angular dev server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run lint` | Run linter |

## 🔐 Authentication

The system uses JWT-based authentication. A default admin user is created on first startup:

- **Email:** `admin@apron.local`
- **Password:** `admin123`

> ⚠️ **Change these credentials in production!**

## 🗃️ Data Model

### FlightPlan Entity
Maps all fields from `flightplans.json`:
- `id` (number) - Primary key
- `ifplid`, `flightId` - Identifiers
- `flightPlanType` - Arrival, Departure, TowOutMovement
- `flightPlanAction` - Active, Completed, etc.
- `linkedFlightId`, `linkedFlightPlanType` - For linked plans
- `carrier`, `flightNumber`, `calculatedCallsign`
- `adep`, `ades` - Departure/Arrival airports
- `stand`, `apron`, `terminal` - Location
- `sta`, `std`, `aibt`, `aobt` - Time fields
- `created`, `updated`, `originDate`

### Stand Entity
Maps all fields from `stands.json`:
- `stand` (string) - Primary key (e.g., "F70")
- `apron` - Apron area
- `terminal` - Terminal name

### StandAssignment Entity
Links flight plans to stands:
- `id` (UUID) - Primary key
- `flightPlan` - Many-to-One relation
- `stand` - Many-to-One relation
- `fromTime`, `toTime` - Assignment period
- `remarks` - Optional notes

## 🔄 Business Logic

### Stand Assignment Overlap Check
A stand cannot be assigned to two flight plans with overlapping time periods.

**Overlap detection formula:**
```
Two intervals [A, B) and [C, D) overlap if: A < D AND C < B
```

On conflict, the API returns `409 Conflict` with a message like:
> "Stand F70 already occupied between 2026-03-06T08:00:00Z and 2026-03-06T10:00:00Z"

### Linked Flight Plans
Flight plans are linked via `linkedFlightId`. The `GET /flight-plans/:id/linked` endpoint returns all flight plans that share the same `linkedFlightId`.

Example: An Arrival and its associated TowOutMovement will have the same `linkedFlightId`.

## 🌐 API Endpoints

### Flight Plans
- `GET /flight-plans` - List with search & filters
- `GET /flight-plans/:id` - Get by ID
- `GET /flight-plans/:id/linked` - Get linked flight plans
- `POST /flight-plans` - Create
- `PATCH /flight-plans/:id` - Update

### Stands
- `GET /stands` - List all stands

### Stand Assignments
- `GET /stand-assignments` - List with filters
- `POST /stand-assignments` - Create (with overlap validation)
- `DELETE /stand-assignments/:id` - Delete

### Authentication
- `POST /auth/login` - Login (returns JWT)
- `GET /auth/profile` - Get current user

### Users (Admin only)
- `GET /users` - List users
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
```

Includes unit tests for:
- Stand assignment overlap/conflict logic
- Service methods

### Frontend Tests
```bash
cd frontend
npm run test
```

Includes tests for:
- FlightPlansService (HTTP testing)
- DashboardComponent

## 🐳 Docker Commands

```bash
# Start PostgreSQL
cd backend
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop PostgreSQL
docker-compose down

# Stop and remove data
docker-compose down -v
```

## 📁 Database Seeding

The database is automatically seeded on application startup. To manually seed:

```bash
cd backend
npm run seed
```

This imports:
- Flight plans from `data/flightplans.json`
- Stands from `data/stands.json`
- Default admin user

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=apron_management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# App
PORT=3000
```

## 📝 Scope & Tradeoffs

### Implemented
- ✅ Full CRUD for flight plans
- ✅ Stand listing and filtering
- ✅ Stand assignments with overlap validation
- ✅ Linked flight plans endpoint
- ✅ JWT authentication
- ✅ Admin user management
- ✅ Database seeding from JSON
- ✅ Angular signals for state management
- ✅ Backend & frontend tests

### Simplified/Skipped
- WebSocket real-time updates (not implemented)
- Pagination on some endpoints
- Advanced role-based permissions
- E2E tests

### Future Improvements
- Add WebSocket for real-time stand assignment updates
- Implement comprehensive E2E testing
- Add caching layer for frequently accessed data
- Implement audit logging
- Add GraphQL API option