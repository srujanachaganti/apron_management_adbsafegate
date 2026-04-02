import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FlightPlansComponent } from './components/flight-plans/flight-plans.component';
import { FlightPlanDetailComponent } from './components/flight-plan-detail/flight-plan-detail.component';
import { StandsComponent } from './components/stands/stands.component';
import { StandDetailComponent } from './components/stand-detail/stand-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'flight-plans',
    component: FlightPlansComponent,
  },
  {
    path: 'flight-plans/:id',
    component: FlightPlanDetailComponent,
  },
  {
    path: 'stands',
    component: StandsComponent,
  },
  {
    path: 'stands/:stand',
    component: StandDetailComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
