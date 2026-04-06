import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FlightPlansComponent } from './components/flight-plans/flight-plans.component';
import { FlightPlanDetailComponent } from './components/flight-plan-detail/flight-plan-detail.component';
import { StandsComponent } from './components/stands/stands.component';
import { StandDetailComponent } from './components/stand-detail/stand-detail.component';
import { StandAssignmentsComponent } from './components/stand-assignments/stand-assignments.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { authGuard, guestGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes (only accessible when NOT logged in)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  // Protected routes (require authentication)
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'flight-plans',
    component: FlightPlansComponent,
    canActivate: [authGuard],
  },
  {
    path: 'flight-plans/:id',
    component: FlightPlanDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stands',
    component: StandsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stands/:stand',
    component: StandDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stand-assignments',
    component: StandAssignmentsComponent,
    canActivate: [authGuard],
  },
  // Admin-only routes
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
