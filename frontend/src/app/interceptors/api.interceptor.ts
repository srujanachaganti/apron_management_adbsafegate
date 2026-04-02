import {
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Add common headers
  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API Error:', error);
      return throwError(() => error);
    }),
  );
};
