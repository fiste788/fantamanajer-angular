import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorResponse } from '@data/types';
import { environment } from '@env';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly snackbar: MatSnackBar) {}

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          const error = err.error as ErrorResponse;
          const message = error.data?.message || err.message;
          this.snackbar.open(message, 'CLOSE', {
            duration: 5000,
          });
          console.error(environment.production ? message : err);
        }

        return observableThrowError(err);
      }),
    );
  }
}
