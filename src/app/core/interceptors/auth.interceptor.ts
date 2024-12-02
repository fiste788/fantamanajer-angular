import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, Observable, of, switchMap, throwError } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { TokenStorageService } from '@app/authentication/token-storage.service';

const NO_AUTH_IT = new HttpContextToken<boolean>(() => false);

function handle401(): Observable<never> {
  return of(inject(AuthenticationService).logoutUI()).pipe(switchMap(() => EMPTY));
}

function handleErrors(
  source: Observable<HttpEvent<unknown>>,
  urlPath: string,
): Observable<HttpEvent<unknown>> {
  return source.pipe(
    catchError((error: unknown) => {
      // try to avoid errors on logout
      // therefore we check the url path of '/auth/'
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !urlPath.includes('/auth/')
      ) {
        return handle401();
      }

      // rethrow error
      return throwError(() => new Error(error as string));
    }),
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let newReq = req;
  if (newReq.context.get(NO_AUTH_IT)) {
    return next(newReq);
  }
  const accessToken = inject(TokenStorageService).token;

  if (accessToken) {
    newReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(newReq).pipe((s) => handleErrors(s, newReq.url));
};

export function noAuthIt(context?: HttpContext): HttpContext {
  return (context ?? new HttpContext()).set(NO_AUTH_IT, true);
}
