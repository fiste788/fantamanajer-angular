import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError } from 'rxjs';

import { NotificationService } from '@app/services';
import { ErrorResponse } from '@data/types';
import { environment } from '@env';

const NO_ERROR_IT = new HttpContextToken<boolean>(() => false);

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const error = err.error as ErrorResponse | null;
        const message = error?.data?.message ?? err.message;
        if (!req.context.get(NO_ERROR_IT)) {
          void notification.open(message, 'CLOSE');
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
