import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorResponse } from '@data/types';
import { environment } from '@env';

const NO_ERROR_IT = new HttpContextToken<boolean>(() => false);

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const error = err.error as ErrorResponse;
        const message = error.data?.message ?? err.message;
        if (!req.context.get(NO_ERROR_IT)) {
          snackbar.open(message, 'CLOSE', {
            duration: 5000,
          });
        }

        console.error(environment.production ? message : err);

        return EMPTY;
      }
      throw err;
    }),
  );
};

export function noErrorIt(context?: HttpContext): HttpContext {
  return (context ?? new HttpContext()).set(NO_ERROR_IT, true);
}
