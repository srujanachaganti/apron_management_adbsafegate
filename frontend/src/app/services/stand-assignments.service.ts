import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {
  StandAssignment,
  CreateStandAssignmentRequest,
  SearchStandAssignmentRequest,
  AvailabilityCheckResponse,
} from '../models/stand-assignment.model';

@Injectable({
  providedIn: 'root',
})
export class StandAssignmentsService {
  private apiUrl = `${environment.apiUrl}/stand-assignments`;

  constructor(private http: HttpClient) {}

  getAll(params?: SearchStandAssignmentRequest): Observable<StandAssignment[]> {
    const queryString = new URLSearchParams();
    if (params?.standId) queryString.append('standId', params.standId);
    if (params?.from) queryString.append('from', params.from);
    if (params?.to) queryString.append('to', params.to);

    const query = queryString.toString();
    return this.http.get<StandAssignment[]>(
      query ? `${this.apiUrl}?${query}` : this.apiUrl,
    );
  }

  getById(id: string): Observable<StandAssignment> {
    return this.http.get<StandAssignment>(`${this.apiUrl}/${id}`);
  }

  getByStand(standId: string): Observable<StandAssignment[]> {
    return this.http.get<StandAssignment[]>(`${this.apiUrl}/stand/${standId}`);
  }

  getByFlightPlan(flightPlanId: number): Observable<StandAssignment[]> {
    return this.http.get<StandAssignment[]>(
      `${this.apiUrl}/flight-plan/${flightPlanId}`,
    );
  }

  create(assignment: CreateStandAssignmentRequest): Observable<StandAssignment> {
    return this.http.post<StandAssignment>(this.apiUrl, assignment).pipe(
      catchError(this.handleError),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkAvailability(
    standId: string,
    fromTime: string,
    toTime: string,
    excludeAssignmentId?: string,
  ): Observable<AvailabilityCheckResponse> {
    const queryString = new URLSearchParams({
      standId,
      fromTime,
      toTime,
    });
    if (excludeAssignmentId) {
      queryString.append('excludeAssignmentId', excludeAssignmentId);
    }

    return this.http.get<AvailabilityCheckResponse>(
      `${this.apiUrl}/check-availability?${queryString.toString()}`,
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 409) {
      errorMessage = 'Stand assignment conflict: The stand is already occupied during this time.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
