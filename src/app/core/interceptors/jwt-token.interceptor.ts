import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { environment } from '@env';

@Injectable()
export class JWTTokenInterceptor implements HttpInterceptor {

  constructor(private readonly auth: AuthenticationService) { }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if ((req.url.startsWith(environment.apiEndpoint) || !req.url.startsWith('http')) && !req.url.endsWith('matchdays/current')) {
      const token = this.auth.getToken();

      let headers = req.headers;
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      return next.handle(req.clone({
        headers
      }));
    }

    return next.handle(req);

  }
}