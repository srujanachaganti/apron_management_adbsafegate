# Apron Management Frontend

A modern **Angular v21 frontend** for managing airport apron operations with flight plans, stands, and assignments.

## Features

✨ **Standalone Components** - Modern Angular architecture without NgModules  
⚡ **Signals for State Management** - Reactive, fine-grained reactivity  
🎯 **Flight Plans Management** - View, search, and filter flight plans  
🔗 **Linked Flight Plans** - See related flight plans by carrier/flight number  
🅿️ **Stand Management** - Track stands across aprons and terminals  
📊 **Dashboard** - Real-time statistics and overview  
🎨 **Modern UI** - Clean, responsive design with gradient navigation  
📱 **Fully Responsive** - Works on desktop and mobile devices

## Tech Stack

- **Angular 21** - Latest Angular framework
- **TypeScript 5** - Type-safe development
- **RxJS 7** - Reactive programming utilities
- **CSS3** - Modern styling with gradients and transitions
- **Angular Router** - Client-side routing

## Project Structure

```
frontend/
├── src/
│   ├── main.ts                    # Bootstrap entry point
│   ├── index.html                 # HTML template
│   ├── styles.css                 # Global styles
│   ├── app/
│   │   ├── app.component.ts       # Root component
│   │   ├── app.config.ts          # App configuration
│   │   ├── app.routes.ts          # Route definitions
│   │   ├── components/
│   │   │   ├── navbar/            # Navigation component
│   │   │   ├── dashboard/         # Dashboard with stats
│   │   │   ├── flight-plans/      # Flight plans list
│   │   │   ├── flight-plan-detail/
│   │   │   ├── stands/            # Stands list
│   │   │   └── stand-detail/
│   │   ├── services/
│   │   │   ├── flight-plans.service.ts
│   │   │   └── stands.service.ts
│   │   ├── models/
│   │   │   ├── flight-plan.model.ts
│   │   │   └── stand.model.ts
│   │   └── interceptors/
│   │       └── api.interceptor.ts
│   └── environments/
│       ├── environment.ts          # Development config
│       └── environment.prod.ts    # Production config
├── angular.json
├── tsconfig.json
└── proxy.conf.json
```

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Angular CLI 21

### Setup Steps

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify the configuration**:
   - Ensure backend is running on `http://localhost:3000`
   - Check `src/environments/environment.ts` for API endpoint

## Running the Application

### Development Server
```bash
npm start
```
Navigate to `http://localhost:4200`. The app will automatically reload when you modify any source files.

### Build for Production
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

## API Endpoints Used

The frontend communicates with the backend at `http://localhost:3000`:

### Flight Plans
- `GET /flight-plans` - Get all flight plans (paginated)
- `GET /flight-plans/:id` - Get flight plan details
- `GET /flight-plans/search` - Search flight plans
- `GET /flight-plans/active` - Get active flights
- `GET /flight-plans/stand/:stand` - Get flights for a stand
- `GET /flight-plans/apron/:apron` - Get flights for an apron
- `GET /flight-plans/linked/:flightId` - Get linked flight plans

### Stands
- `GET /stands` - Get all stands (paginated)
- `GET /stands/:stand` - Get stand details
- `GET /stands/search` - Search stands
- `GET /stands/by-apron/:apron` - Get stands by apron
- `GET /stands/by-terminal/:terminal` - Get stands by terminal

## Component Breakdown

### Root Component (`AppComponent`)
- Renders the navigation bar
- Manages router outlet for page content

### Navigation (`NavbarComponent`)
- Sticky header with links to all main pages
- Gradient purple background
- Responsive design

### Dashboard (`DashboardComponent`)
- Displays key statistics:
  - Total flight plans
  - Active flights count
  - Total stands
  - Assigned stands
- Shows recent flight plans in a table
- Uses signals for reactive updates

### Flight Plans (`FlightPlansComponent`)
- Paginated list of all flight plans
- Search filters:
  - Carrier (airline code)
  - Flight number
  - Stand assignment
  - Apron
- Responsive table with navigation
- Pagination controls

### Flight Plan Detail (`FlightPlanDetailComponent`)
- Comprehensive flight information
- Aircraft details
- Airport and timing information
- Linked flight plans section
- Back navigation

### Stands (`StandsComponent`)
- Paginated list of all stands
- Search filters:
  - Stand name
  - Apron
  - Terminal
- Table with stand information
- Pagination controls

### Stand Detail (`StandDetailComponent`)
- Stand information display
- Currently assigned flights
- Links to flight plan details
- Back navigation

## Signals in Action

The frontend uses Angular signals for state management across components:

```typescript
// Dashboard component
totalFlightPlans = signal(0);
activeFlightPlans = signal(0);
recentFlightPlans = signal<FlightPlan[]>([]);

// Flight Plans component
flightPlans = signal<FlightPlan[]>([]);
loading = signal(false);
currentPage = signal(1);
totalPages = signal(1);
```

Signals provide:
- Fine-grained reactivity
- Automatic track dependency tracking
- Better performance than Zone.js
- Simpler state updates without RxJS observables

## Standalone Components

All components are standalone (no NgModules required):

```typescript
@Component({
  selector: 'app-flight-plans',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  // ...
})
```

Benefits:
- Smaller bundle sizes
- Lazy loading by default
- Clearer dependency management
- Modern Angular development

## Styling Architecture

The application uses:
- **Inline component styles** - Scoped to each component
- **Global styles** - Base typography, reset, utilities
- **CSS Gradients** - Modern visual effects
- **Responsive Grid** - Mobile-friendly layouts
- **Hover Effects** - Interactive feedback

### Color Scheme
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Success: `#d4edda` (Light Green)
- Warning: `#f8d7da` (Light Red)
- Background: `#f5f5f7` (Light Gray)

## Services

### FlightPlansService
Handles all flight plan API calls:
- Fetch all flight plans (paginated)
- Search with filters
- Get flight plan details
- Get flights by stand/apron
- Get linked flight plans
- CRUD operations

### StandsService
Handles all stand API calls:
- Fetch all stands (paginated)
- Search stands
- Get stand details
- Get stands by apron/terminal
- CRUD operations

## HTTP Interceptor

The API interceptor (`api.interceptor.ts`):
- Adds common headers (Content-Type)
- Handles global error logging
- Can be extended for authentication tokens

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run e2e
```

## Code Quality

### Format Code
```bash
npm run format
```

### Check Formatting
```bash
npm run format:check
```

## Environment Configuration

### Development (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

### Production (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.apron-management.com',
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari 15+
- Edge (latest)

## Performance Optimizations

- Standalone components (smaller bundle)
- Signals (fine-grained reactivity)
- OnPush change detection strategy
- Lazy loading routes
- Production build optimization

## Future Enhancements

- [ ] Authentication/Login page
- [ ] Stand assignment management UI
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering panel
- [ ] Export to CSV/PDF
- [ ] Dark mode toggle
- [ ] Flight status timeline
- [ ] Map visualization
- [ ] Notifications system
- [ ] Mobile app (NativeScript/Ionic)

## Troubleshooting

### Port Already in Use
- Default dev server runs on port 4200
- Change with: `ng serve --port 4300`

### Backend Not Reachable
- Ensure backend is running on `http://localhost:3000`
- Check CORS is enabled on backend
- Verify proxy config in `proxy.conf.json`

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild: `npm run build`
- Check browser DevTools for CSS errors

### Build Errors
- Delete `node_modules` and reinstall: `npm install`
- Clear Angular cache: `ng cache clean`
- Update Angular CLI: `npm install -g @angular/cli@latest`

## License

MIT

## References

- [Angular Documentation](https://angular.io)
- [Angular Signals](https://angular.io/guide/signals)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev)
