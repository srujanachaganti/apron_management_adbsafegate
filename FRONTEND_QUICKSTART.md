# 🚀 Angular Frontend - Quick Start Guide

## Installation & Run Steps

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will be available at **http://localhost:4200**

### 3. Backend Requirement
Ensure the backend is running on `http://localhost:3000` before starting the frontend.

---

## 📁 Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/              # Navigation bar
│   │   │   ├── dashboard/           # Overview page
│   │   │   ├── flight-plans/        # Flight plans list
│   │   │   ├── flight-plan-detail/  # Flight plan details
│   │   │   ├── stands/              # Stands list
│   │   │   └── stand-detail/        # Stand details
│   │   ├── services/
│   │   │   ├── flight-plans.service.ts
│   │   │   └── stands.service.ts
│   │   ├── models/
│   │   │   ├── flight-plan.model.ts
│   │   │   └── stand.model.ts
│   │   ├── interceptors/
│   │   │   └── api.interceptor.ts
│   │   ├── app.component.ts         # Root component
│   │   ├── app.config.ts            # Configuration
│   │   └── app.routes.ts            # Routes
│   ├── environments/
│   │   ├── environment.ts           # Dev config
│   │   └── environment.prod.ts      # Prod config
│   ├── styles.css                   # Global styles
│   └── index.html
└── angular.json
```

---

## 🌐 Available Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Dashboard | Statistics & overview |
| `/flight-plans` | FlightPlans | List all flight plans |
| `/flight-plans/:id` | FlightPlanDetail | Flight details |
| `/stands` | Stands | List all stands |
| `/stands/:stand` | StandDetail | Stand details |

---

## ⚡ Key Features

- **Standalone Components** - Modern Angular without NgModules
- **Angular Signals** - Reactive state management
- **Search & Filter** - Flight plans by carrier, stand, apron
- **Pagination** - Browse large datasets
- **Linked Views** - See related flight plans
- **Responsive Design** - Mobile-friendly layout

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:cov

# Run E2E tests
npm run e2e
```

---

## 🎨 Development Commands

```bash
# Build for production
npm run build

# Watch & rebuild on changes
npm run watch

# Format code
npm run format

# Check code formatting
npm run format:check
```

---

## 🌍 Environment Configuration

### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.apron-management.com',
};
```

---

## 🔌 API Integration

Services communicate with backend API:

**Flight Plans Service**
```typescript
getAll()              // Get all flight plans (paginated)
search()              // Search with filters
getById()             // Get single flight plan
getLinkedFlightPlans()// Get related flights
getByStand()          // Get flights at stand
getByApron()          // Get flights at apron
```

**Stands Service**
```typescript
getAll()              // Get all stands
search()              // Search stands
getByStand()          // Get single stand
getByApron()          // Get stands by apron
getByTerminal()       // Get stands by terminal
```

---

## 💡 Using Signals for State

```typescript
// Define signals
flightPlans = signal<FlightPlan[]>([]);
loading = signal(false);
currentPage = signal(1);

// Update signals
flightPlans.set(data);
loading.set(true);

// Read signals in template
{{ flightPlans() }}

// Track changes
import { effect } from '@angular/core';
effect(() => {
  console.log('Page changed:', currentPage());
});
```

---

## 🎯 Component Communication

**Parent to Child:**
```typescript
@Input() data: FlightPlan;
@Input() loading: signal<boolean>;
```

**Child to Parent:**
```typescript
@Output() selected = new EventEmitter<FlightPlan>();
```

**Via Service:**
Services provide shared state across components via observables and signals.

---

## 📦 Build & Deploy

### Development Build
```bash
npm run build
# Output in dist/
```

### Production Build
```bash
npm run build -- --configuration production
# Optimized output in dist/
```

### Deploy to Static Host
```bash
# Vercel
vercel deploy dist/

# Netlify
# Drag & drop dist/ folder

# AWS S3
aws s3 sync dist/ s3://bucket-name/

# GitHub Pages
# Push dist/ to gh-pages branch
```

---

## 🆘 Troubleshooting

### Port 4200 Already in Use
```bash
ng serve --port 4300
```

### Backend Connection Failed
- Verify backend runs on `http://localhost:3000`
- Check network tab in DevTools
- Ensure CORS is enabled on backend

### Hot Reload Not Working
```bash
# Restart dev server
npm start
```

### Build Errors
```bash
# Clear cache
ng cache clean

# Reinstall
rm -rf node_modules
npm install
```

---

## 📖 More Information

- [Angular Documentation](https://angular.io)
- [Angular Signals Guide](https://angular.io/guide/signals)
- [RxJS Documentation](https://rxjs.dev)

For full stack setup, see [FULLSTACK_README.md](../FULLSTACK_README.md)
