import {
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const TOKEN_KEY = 'auth_token';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem(TOKEN_KEY);

  // Clone request and add headers
  let authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    },
  });

  // Add Authorization header if token exists
  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API Error:', error);

      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('auth_user');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
