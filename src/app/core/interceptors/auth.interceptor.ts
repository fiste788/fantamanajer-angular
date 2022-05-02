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
import { catchError, EMPTY, Observable, of, switchMap, throwError } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { TokenStorageService } from '@app/authentication/token-storage.service';

const NO_AUTH_IT = new HttpContextToken<boolean>(() => false);

export function noAuthIt(context?: HttpContext): HttpContext {
  return (context || new HttpContext()).set(NO_AUTH_IT, true);
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly tokenStorageService: TokenStorageService,
    private readonly authService: AuthenticationService,
  ) {}

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.context.get(NO_AUTH_IT)) {
      return next.handle(req);
    }
    const accessToken = this.tokenStorageService.token;

    if (accessToken) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }

    return next.handle(req).pipe((s) => this.handleErrors(s, req.url));
  }

  private handleErrors(
    source: Observable<HttpEvent<unknown>>,
    urlPath: string,
  ): Observable<HttpEvent<unknown>> {
    return source.pipe(
      catchError((error: unknown) => {
        // try to avoid errors on logout
        // therefore we check the url path of '/auth/'
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 && !urlPath.includes('/auth/')) {
            return this.handle401();
          }
        }

        // rethrow error
        return throwError(() => error);
      }),
    );
  }

  private handle401(): Observable<never> {
    return of(this.authService.logoutUI()).pipe(switchMap(() => EMPTY));
  }
}
