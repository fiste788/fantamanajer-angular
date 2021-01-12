
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private readonly snackbar: MatSnackBar) { }

  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next
      .handle(req)
      .pipe(
        catchError((err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            const error = err.error as { data: { message: string, errors: { [key: string]: { [key: string]: unknown } } } };
            let message = '';
            try {
              message = error.data.message;
            } catch (e) {
              message = err.message;
            }
            console.error(message);
            this.snackbar.open(message, 'CLOSE', {
              duration: 5000,
            });
          }

          return observableThrowError(err);
        }),
      );
    // return next.handle(req);
  }
}
