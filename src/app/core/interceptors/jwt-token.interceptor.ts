import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';

const NO_AUTH_IT = new HttpContextToken<boolean>(() => false);

export function noAuthIt(): HttpContext {
  return new HttpContext().set(NO_AUTH_IT, true);
}

@Injectable()
export class JWTTokenInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AuthenticationService) {}

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.context.get(NO_AUTH_IT)) {
      return next.handle(req);
    }
    const token = this.auth.getToken();

    let headers = req.headers;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return next.handle(
      req.clone({
        headers,
      }),
    );
  }
}
