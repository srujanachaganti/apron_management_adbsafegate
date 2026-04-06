import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'user';
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  // Signals for reactive state
  private usersSignal = signal<User[]>([]);
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public computed values
  users = this.usersSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor(private http: HttpClient) {}

  loadUsers(): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => {
        this.usersSignal.set(users);
        this.isLoadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load users');
        this.isLoadingSignal.set(false);
      },
    });
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(data: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, data).pipe(
      tap((newUser) => {
        this.usersSignal.update((users) => [...users, newUser]);
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  updateUser(id: string, data: UpdateUserRequest): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data).pipe(
      tap((updatedUser) => {
        this.usersSignal.update((users) =>
          users.map((u) => (u.id === id ? updatedUser : u)),
        );
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.usersSignal.update((users) => users.filter((u) => u.id !== id));
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  toggleUserStatus(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/toggle-active`, {}).pipe(
      tap((updatedUser) => {
        this.usersSignal.update((users) =>
          users.map((u) => (u.id === id ? updatedUser : u)),
        );
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
