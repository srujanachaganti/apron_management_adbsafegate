import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Stand, PaginatedResponse, SearchStandRequest } from '../models/stand.model';

@Injectable({
  providedIn: 'root',
})
export class StandsService {
  private apiUrl = `${environment.apiUrl}/stands`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, limit: number = 50): Observable<PaginatedResponse<Stand>> {
    return this.http.get<PaginatedResponse<Stand>>(
      `${this.apiUrl}?page=${page}&limit=${limit}`,
    );
  }

  search(params: SearchStandRequest): Observable<Stand[]> {
    const queryString = new URLSearchParams();
    if (params.apron) queryString.append('apron', params.apron);
    if (params.terminal) queryString.append('terminal', params.terminal);
    if (params.stand) queryString.append('stand', params.stand);

    return this.http.get<Stand[]>(
      `${this.apiUrl}/search?${queryString.toString()}`,
    );
  }

  getByStand(stand: string): Observable<Stand> {
    return this.http.get<Stand>(`${this.apiUrl}/${stand}`);
  }

  getByApron(apron: string): Observable<Stand[]> {
    return this.http.get<Stand[]>(`${this.apiUrl}/by-apron/${apron}`);
  }

  getByTerminal(terminal: string): Observable<Stand[]> {
    return this.http.get<Stand[]>(`${this.apiUrl}/by-terminal/${terminal}`);
  }

  create(stand: Stand): Observable<Stand> {
    return this.http.post<Stand>(this.apiUrl, stand);
  }

  update(standId: string, stand: Partial<Stand>): Observable<Stand> {
    return this.http.patch<Stand>(`${this.apiUrl}/${standId}`, stand);
  }

  delete(standId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${standId}`);
  }
}
