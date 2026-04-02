export interface FlightPlan {
  id: number;
  ifplid: string;
  flightId: string;
  flightPlanType: string;
  flightPlanAction: string;
  created: Date;
  updated: Date;
  linkedFlightId: string | null;
  linkedFlightPlanType: string | null;
  originDate: Date;
  carrier: string;
  flightNumber: string;
  calculatedCallsign: string;
  aircraftRegistration: string;
  aircraftType: string;
  aircraftTypeIcao: string;
  adep: string;
  ades: string;
  stand: string | null;
  apron: string | null;
  terminal: string | null;
  aibt: Date | null;
  sta: Date | null;
  aobt: Date;
  std: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SearchFlightPlanRequest {
  carrier?: string;
  flightNumber?: string;
  stand?: string;
  apron?: string;
  terminal?: string;
  page?: number;
  limit?: number;
}
