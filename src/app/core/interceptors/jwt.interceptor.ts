import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
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
    if (req.url.startsWith(environment.apiEndpoint) || !req.url.startsWith('http')) {
      const token = this.auth.getToken();

      let headers = req.headers;
      headers = headers.set('Accept', 'application/json');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`)
      }
      if (!req.headers.has('Content-type')) {
        headers = headers.set('Content-type', 'application/json');
      } else if (headers.get('Content-Type') === 'multipart/form-data') {
        headers = headers.delete('Content-type');
      }

      return next.handle(req.clone({
        headers
      }));
    } else {
      return next.handle(req);
    }
  }
}
