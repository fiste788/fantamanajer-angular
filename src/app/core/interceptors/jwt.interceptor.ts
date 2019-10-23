import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@app/core/services';
import { environment } from 'environments/environment';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if ((req.url.startsWith(environment.apiEndpoint) || !req.url.startsWith('http')) && !req.url.endsWith('matchdays/current')) {
      const token = this.auth.getToken();

      let headers = req.headers;
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      return next.handle(req.clone({
        headers
      }));
    } else {
      return next.handle(req);
    }
  }
}
