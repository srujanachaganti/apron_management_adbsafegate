import { FlightPlan } from './flight-plan.model';
import { Stand } from './stand.model';

export interface StandAssignment {
  id: string;
  flightPlanId: number;
  standId: string;
  fromTime: Date | string;
  toTime: Date | string;
  remarks?: string;
  createdAt?: Date;
  updatedAt?: Date;
  flightPlan?: FlightPlan;
  stand?: Stand;
}

export interface CreateStandAssignmentRequest {
  flightPlanId: number;
  standId: string;
  fromTime: string;
  toTime: string;
  remarks?: string;
}

export interface SearchStandAssignmentRequest {
  standId?: string;
  from?: string;
  to?: string;
}

export interface AvailabilityCheckResponse {
  available: boolean;
  conflicts: StandAssignment[];
}
