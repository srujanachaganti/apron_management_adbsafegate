import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  FlightPlan,
  PaginatedResponse,
  SearchFlightPlanRequest,
} from '../models/flight-plan.model';

@Injectable({
  providedIn: 'root',
})
export class FlightPlansService {
  private apiUrl = `${environment.apiUrl}/flight-plans`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, limit: number = 50): Observable<PaginatedResponse<FlightPlan>> {
    return this.http.get<PaginatedResponse<FlightPlan>>(
      `${this.apiUrl}?page=${page}&limit=${limit}`,
    );
  }

  getActiveFlightPlans(page: number = 1, limit: number = 50): Observable<PaginatedResponse<FlightPlan>> {
    return this.http.get<PaginatedResponse<FlightPlan>>(
      `${this.apiUrl}/active?page=${page}&limit=${limit}`,
    );
  }

  search(params: SearchFlightPlanRequest): Observable<PaginatedResponse<FlightPlan>> {
    const queryString = new URLSearchParams();
    if (params.search) queryString.append('search', params.search);
    if (params.carrier) queryString.append('carrier', params.carrier);
    if (params.flightNumber) queryString.append('flightNumber', params.flightNumber);
    if (params.flightPlanType) queryString.append('flightPlanType', params.flightPlanType);
    if (params.stand) queryString.append('stand', params.stand);
    if (params.apron) queryString.append('apron', params.apron);
    if (params.terminal) queryString.append('terminal', params.terminal);
    if (params.originDateFrom) queryString.append('originDateFrom', params.originDateFrom);
    if (params.originDateTo) queryString.append('originDateTo', params.originDateTo);
    if (params.limit) queryString.append('limit', params.limit.toString());
    if (params.page) queryString.append('page', params.page.toString());

    return this.http.get<PaginatedResponse<FlightPlan>>(
      `${this.apiUrl}?${queryString.toString()}`,
    );
  }

  getById(id: number): Observable<FlightPlan> {
    return this.http.get<FlightPlan>(`${this.apiUrl}/${id}`);
  }

  getByStand(stand: string): Observable<FlightPlan[]> {
    return this.http.get<FlightPlan[]>(`${this.apiUrl}/stand/${stand}`);
  }

  getByApron(apron: string): Observable<FlightPlan[]> {
    return this.http.get<FlightPlan[]>(`${this.apiUrl}/apron/${apron}`);
  }

  /**
   * Get linked flight plans by flight plan ID
   */
  getLinkedFlightPlans(id: number): Observable<FlightPlan[]> {
    return this.http.get<FlightPlan[]>(`${this.apiUrl}/${id}/linked`);
  }

  create(flightPlan: FlightPlan): Observable<FlightPlan> {
    return this.http.post<FlightPlan>(this.apiUrl, flightPlan);
  }

  update(id: number, flightPlan: Partial<FlightPlan>): Observable<FlightPlan> {
    return this.http.patch<FlightPlan>(`${this.apiUrl}/${id}`, flightPlan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
