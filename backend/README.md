# Apron Management System - Backend

A **NestJS v10** backend application for managing airport apron operations with flight plans and stand assignments.

This is **Part 1 of a full-stack application**. See [FULLSTACK_README.md](../FULLSTACK_README.md) for the complete system setup including the Angular frontend.

## Tech Stack

- **NestJS v10** - Progressive Node.js framework
- **TypeORM** - ORM for database management
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe development
- **Docker** - Database containerization

## Project Structure

```
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
├── database/
│   ├── database.config.ts           # TypeORM configuration
│   ├── database.module.ts           # Database module
│   ├── entities/
│   │   ├── flight-plan.entity.ts   # FlightPlan entity
│   │   └── stand.entity.ts          # Stand entity
│   └── seeds/
│       └── seed.service.ts          # Database seeding service
└── modules/
    ├── flight-plans/
    │   ├── controllers/
    │   ├── services/
    │   ├── dtos/
    │   └── flight-plans.module.ts
    └── stands/
        ├── controllers/
        ├── services/
        ├── dtos/
        └── stands.module.ts
```

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose
- PostgreSQL 13+ (or use provided Docker setup)

### Setup Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials.

3. **Start PostgreSQL** (using Docker):
   ```bash
   docker-compose up -d
   ```
   This starts a PostgreSQL instance on port 5432.

4. **Run database migrations** (if any):
   ```bash
   npm run migration:run
   ```

5. **Seed the database**:
   ```bash
   npm run seed
   ```
   This loads data from `data/flightplans.json` and `data/stands.json`.

## Running the Application

### Development Mode
```bash
npm run start:dev
```
The server will start on http://localhost:3000

### Production Mode
```bash
npm run build
npm run start:prod
```

## Database Schema

### FlightPlan Entity

All fields from `flightplans.json` are mapped to columns:

| Column | Type | Nullable |
|--------|------|----------|
| id | INTEGER | NO (PK) |
| ifplid | VARCHAR | YES |
| flightId | UUID | NO |
| flightPlanType | VARCHAR | NO |
| flightPlanAction | VARCHAR | NO |
| created | TIMESTAMP | NO |
| updated | TIMESTAMP | NO |
| linkedFlightId | VARCHAR | YES |
| linkedFlightPlanType | VARCHAR | YES |
| originDate | DATE | NO |
| carrier | VARCHAR(3) | NO |
| flightNumber | VARCHAR(5) | NO |
| calculatedCallsign | VARCHAR | NO |
| aircraftRegistration | VARCHAR(6) | NO |
| aircraftType | VARCHAR | NO |
| aircraftTypeIcao | VARCHAR | NO |
| adep | VARCHAR(4) | NO |
| ades | VARCHAR(4) | NO |
| stand | VARCHAR | YES |
| apron | VARCHAR | YES |
| terminal | VARCHAR | YES |
| aibt | TIMESTAMP | YES |
| sta | TIMESTAMP | YES |
| aobt | TIMESTAMP | NO |
| std | TIMESTAMP | NO |

### Stand Entity

| Column | Type | Nullable |
|--------|------|----------|
| stand | VARCHAR | NO (PK) |
| apron | VARCHAR | YES |
| terminal | VARCHAR | YES |

## API Endpoints

### Flight Plans

#### GET `/flight-plans`
Get all flight plans (paginated)
```bash
curl http://localhost:3000/flight-plans?page=1&limit=50
```

#### GET `/flight-plans/search`
Search flight plans by criteria
```bash
curl "http://localhost:3000/flight-plans/search?carrier=AF&stand=K21"
```

#### GET `/flight-plans/active`
Get all active flight plans
```bash
curl http://localhost:3000/flight-plans/active
```

#### GET `/flight-plans/stand/:stand`
Get flight plans for a specific stand
```bash
curl http://localhost:3000/flight-plans/stand/K21
```

#### GET `/flight-plans/apron/:apron`
Get flight plans for a specific apron
```bash
curl http://localhost:3000/flight-plans/apron/Aire_T2E_S3
```

#### GET `/flight-plans/linked/:flightId`
Get linked flight plans
```bash
curl http://localhost:3000/flight-plans/linked/299428080897
```

#### GET `/flight-plans/:id`
Get a specific flight plan
```bash
curl http://localhost:3000/flight-plans/97238
```

#### POST `/flight-plans`
Create a new flight plan
```bash
curl -X POST http://localhost:3000/flight-plans \
  -H "Content-Type: application/json" \
  -d '{ "id": 99999, "flightId": "...", ... }'
```

#### PATCH `/flight-plans/:id`
Update a flight plan
```bash
curl -X PATCH http://localhost:3000/flight-plans/97238 \
  -H "Content-Type: application/json" \
  -d '{ "stand": "K22" }'
```

#### DELETE `/flight-plans/:id`
Delete a flight plan
```bash
curl -X DELETE http://localhost:3000/flight-plans/97238
```

### Stands

#### GET `/stands`
Get all stands (paginated)
```bash
curl http://localhost:3000/stands?page=1&limit=50
```

#### GET `/stands/search`
Search stands
```bash
curl "http://localhost:3000/stands/search?apron=Aire_T2E_S3"
```

#### GET `/stands/by-apron/:apron`
Get stands by apron
```bash
curl http://localhost:3000/stands/by-apron/Aire_T2E_S3
```

#### GET `/stands/by-terminal/:terminal`
Get stands by terminal
```bash
curl http://localhost:3000/stands/by-terminal/Terminal_2
```

#### GET `/stands/:stand`
Get a specific stand
```bash
curl http://localhost:3000/stands/K21
```

#### POST `/stands`
Create a new stand
```bash
curl -X POST http://localhost:3000/stands \
  -H "Content-Type: application/json" \
  -d '{ "stand": "N01", "apron": "Aire_North", "terminal": "Terminal_3" }'
```

#### PATCH `/stands/:stand`
Update a stand
```bash
curl -X PATCH http://localhost:3000/stands/K21 \
  -H "Content-Type: application/json" \
  -d '{ "apron": "Aire_T2E_S3" }'
```

#### DELETE `/stands/:stand`
Delete a stand
```bash
curl -X DELETE http://localhost:3000/stands/K21
```

## Development

### Run Linting
```bash
npm run lint
```

### Run Tests
```bash
npm test
```

### Format Code
```bash
npm run format
```

### Database Migrations

Generate a new migration:
```bash
npm run migration:generate -- -n MigrationName
```

Run migrations:
```bash
npm run migration:run
```

Revert migrations:
```bash
npm run migration:revert
```

## Design Decisions

1. **TypeORM with PostgreSQL**: Chosen for robust relational data modeling and type safety with TypeScript.

2. **Module-based Structure**: Each domain (FlightPlans, Stands) is isolated in its own module for maintainability.

3. **DTOs for Validation**: Class-validator with DTOs ensures input validation and transformation.

4. **JSON Seeding**: Data is loaded directly from the provided JSON files into the database on startup.

5. **Pagination**: API endpoints support pagination to handle large datasets efficiently.

6. **Nullable Fields**: Fields that can be null in the JSON (e.g., `stand`, `apron`) are nullable in the database schema.

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `docker-compose ps`
- Check `.env` file for correct credentials
- Verify port 5432 is not in use

### Seed Script Fails
- Ensure `data/flightplans.json` and `data/stands.json` exist
- Check file paths are correct relative to project root

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the service using port 3000

## Future Enhancements

- [ ] Authentication & Authorization (JWT)
- [ ] Stand Assignment Management
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and aggregations
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Performance optimization (caching, indexing)
- [ ] Event logging and audit trails

## License

MIT
