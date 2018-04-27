import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const JWT = token ? `Bearer ${token}` : '';
    const data = {
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: JWT
      }
    };
    return next.handle(req.clone(data));
  }
}
