# Full-Stack Apron Management System

A complete **full-stack application** for managing airport apron operations, including flight plans and stand assignments.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Apron Management System                       │
│            NestJS Backend + Angular 21 Frontend                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Project Overview

This project demonstrates a modern full-stack development approach with:

- **Backend**: NestJS v10 + TypeORM + PostgreSQL
- **Frontend**: Angular v21 with standalone components & signals
- **Data**: JSON seeding for flight plans and stands
- **Architecture**: Service-based design, modular organization
- **Features**: Search, filtering, pagination, linked data views

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **npm or yarn**
- **Docker & Docker Compose** (for PostgreSQL)
- **PostgreSQL 13+** (or use Docker)
- **Angular CLI 21**

### Directory Structure

```
apron_management_adbsafegate/
├── backend/                       # NestJS Backend
│   ├── src/                       # Backend source code
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── database/
│   │   │   ├── entities/
│   │   │   ├── seeds/
│   │   │   └── database.module.ts
│   │   └── modules/
│   │       ├── flight-plans/
│   │       └── stands/
│   ├── package.json
│   ├── tsconfig.json
│   ├── docker-compose.yml
│   └── README.md
├── frontend/                      # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   ├── environments/
│   │   ├── styles.css
│   │   └── index.html
│   ├── angular.json
│   ├── tsconfig.json
│   └── README.md
├── data/                          # Seed data
│   ├── flightplans.json
│   └── stands.json
├── assignment.md                  # Original assignment
└── FULLSTACK_README.md           # This file
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials (default is local PostgreSQL).

### 4. Start PostgreSQL

```bash
docker-compose up -d
```

Verify the database is running:
```bash
docker-compose ps
```

### 5. Seed the Database

```bash
npm run seed
```

This loads data from `../data/flightplans.json` and `../data/stands.json` into PostgreSQL.

### 6. Start Backend Server

**Development Mode:**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run build
npm run start:prod
```

The backend will start on **http://localhost:3000**

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

The frontend will start on **http://localhost:4200**

## 📊 API Documentation

### Flight Plans Endpoints

```bash
# Get all flight plans
GET /flight-plans?page=1&limit=50

# Search flight plans
GET /flight-plans/search?carrier=AF&stand=K21

# Get active flights
GET /flight-plans/active

# Get specific flight plan
GET /flight-plans/97238

# Get flights for a stand
GET /flight-plans/stand/K21

# Get flights for an apron
GET /flight-plans/apron/Aire_T2E_S3

# Get linked flight plans
GET /flight-plans/linked/299428080897
```

### Stands Endpoints

```bash
# Get all stands
GET /stands?page=1&limit=50

# Search stands
GET /stands/search?apron=Aire_T2E_S3

# Get specific stand
GET /stands/K21

# Get stands by apron
GET /stands/by-apron/Aire_T2E_S3

# Get stands by terminal
GET /stands/by-terminal/Terminal_2
```

## 🖥️ Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Dashboard | Overview with statistics |
| `/flight-plans` | FlightPlans | List all flight plans |
| `/flight-plans/:id` | FlightPlanDetail | Flight plan details |
| `/stands` | Stands | List all stands |
| `/stands/:stand` | StandDetail | Stand details & assignments |

## 📈 Getting Started with the App

### Dashboard

- View key statistics (total flights, active flights, etc.)
- See recent flight plans
- Navigate to detailed views

### Flight Plans

- Search by carrier, flight number, stand, or apron
- View flight plan details including:
  - Aircraft information
  - Airport codes
  - Timing details
  - Linked flight plans
- Browse paginated results

### Stands

- View all airport stands
- Search by stand name, apron, or terminal
- See currently assigned flights
- View stand details

## 🏗️ Architecture Overview

### Backend Architecture

```
Request
  │
  ├─> Controller (REST API)
  ├─> Service (Business Logic)
  ├─> Repository (TypeORM)
  └─> Database (PostgreSQL)
```

**Key Components:**
- **Entities**: Database models (FlightPlan, Stand)
- **Services**: Business logic & data operations
- **Controllers**: HTTP endpoints & request handling
- **DTOs**: Data validation & transformation
- **Interceptors**: Global error handling & logging

### Frontend Architecture

```
Components (Standalone)
  ├─> Services (API Communication)
  ├─> Models (TypeScript Interfaces)
  ├─> Signals (State Management)
  └─> HTTP Client (Backend Communication)
```

**Key Features:**
- **Standalone Components**: No NgModules required
- **Signals**: Fine-grained reactivity
- **Services**: Centralized API communication
- **Routing**: Client-side navigation
- **Interceptors**: Global HTTP handling

## 🔄 Data Flow

```
1. Frontend Component Init
   ↓
2. Calls Service Method
   ↓
3. Service makes HTTP Request
   ↓
4. Backend Controller receives Request
   ↓
5. Service executes Business Logic
   ↓
6. Repository queries Database
   ↓
7. Returns Data to Controller
   ↓
8. Controller sends HTTP Response
   ↓
9. Frontend Service receives Response
   ↓
10. Updates Signal/State
   ↓
11. Component detects Change
   ↓
12. Updates Template
```

## 🧪 Testing

### Backend Tests
```bash
npm test
npm test:cov
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Development Guidelines

### Code Style

- **Backend**: ESLint + Prettier (configured)
- **Frontend**: ESLint + Prettier (configured)

Format code:
```bash
# Backend
npm run format

# Frontend
cd frontend && npm run format
```

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## 🛠️ Troubleshooting

### Backend Issues

#### Connection Refused
```bash
# Navigate to backend directory
cd backend

# Check PostgreSQL is running
docker-compose ps

# Start PostgreSQL
docker-compose up -d
```

#### Port Already in Use
```bash
# Navigate to backend directory
cd backend

# Change PORT in .env
PORT=3001
```

#### Seed Script Fails
```bash
# Navigate to backend directory
cd backend

# Ensure data files exist
ls ../data/flightplans.json
ls ../data/stands.json

# Check file permissions
chmod 644 ../data/*.json
```

### Frontend Issues

#### Cannot Connect to Backend
- Verify backend is running on `http://localhost:3000`
- Check proxy config in `frontend/proxy.conf.json`
- Ensure CORS is enabled on backend

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Clear Angular cache
ng cache clean
```

#### Hot Reload Not Working
```bash
# Restart dev server
npm start
```

## 📚 Documentation

- [Backend README](./backend/README.md) - NestJS setup & API details
- [Frontend README](./frontend/README.md) - Angular setup & components

## 🔐 Security Considerations

1. **Environment Variables**: Keep secrets in `.env` files (not in git)
2. **CORS**: Configure allowed origins in production
3. **Validation**: DTOs validate all incoming data
4. **SQL Injection**: TypeORM parameterized queries prevent SQL injection
5. **Error Handling**: Generic error messages in production

## 🚀 Deployment

### Backend Deployment

```bash
# Navigate to backend directory
cd backend

# Build production
npm run build

# Run production server
npm run start:prod

# With Docker
docker build -t apron-backend .
docker run -p 3000:3000 apron-backend
```

### Frontend Deployment

```bash
# Navigate to frontend directory
cd frontend

# Build production
npm run build

# Deploy dist/ to static hosting (Vercel, Netlify, S3, etc.)
```

## 🎯 Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] User authentication with JWT
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Mobile app (NativeScript)
- [ ] GraphQL API
- [ ] Performance optimization
- [ ] Automated testing suite

## 🤝 Contributing

When contributing to this project:

1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes locally
4. Update documentation as needed

## 📄 License

MIT License

## 👥 Team

Developed as a full-stack demonstration project.

---

## 🎓 Learning Resources

This project demonstrates:

- ✅ Modern NestJS patterns (modules, services, controllers)
- ✅ TypeORM with PostgreSQL
- ✅ Angular 21 with standalone components
- ✅ Angular signals for state management
- ✅ Reactive programming with RxJS
- ✅ RESTful API design
- ✅ Responsive web design
- ✅ Error handling and validation
- ✅ Docker containerization
- ✅ Database seeding

**Key Takeaways:**
- Microservices architecture basics
- Separation of concerns
- Reusable components & services
- Signal-based state management
- HTTP interceptors for cross-cutting concerns
- Pagination and filtering patterns

---

**Start the application now!** 🚀

```bash
# Terminal 1: Backend
cd backend
npm install
docker-compose up -d
npm run seed
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm install
npm start

# Open http://localhost:4200
```

