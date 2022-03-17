import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorResponse } from '@data/types';
import { environment } from '@env';

const NO_ERROR_IT = new HttpContextToken<boolean>(() => false);

export function noErrorIt(context?: HttpContext): HttpContext {
  return (context || new HttpContext()).set(NO_ERROR_IT, true);
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly snackbar: MatSnackBar) {}

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          const error = err.error as ErrorResponse;
          const message = error.data?.message || err.message;
          if (req.context.get(NO_ERROR_IT)) {
            this.snackbar.open(message, 'CLOSE', {
              duration: 5000,
            });
          }
          console.error(environment.production ? message : err);
        }
        return throwError(() => err);
      }),
    );
  }
}
