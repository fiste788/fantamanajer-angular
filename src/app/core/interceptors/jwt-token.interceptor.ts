import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/core/services';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class JWTTokenInterceptor implements HttpInterceptor {

  constructor(private readonly auth: AuthService) { }

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
