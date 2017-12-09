import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(private snackbar: MatSnackBar) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const JWT = token ? `Bearer ${token}` : '';
    const data = {
      url: environment.apiEndpoint + req.url,
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: JWT
      }
    };
    req = req.clone(data);

    return next
      .handle(req)
      .pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          event = event.clone({
            body: event.body.data
          });
          return event;
        }
      }))
      .catch((err: any, caught) => {
        if (err instanceof HttpErrorResponse) {
          let message = '';
          try {
            message = err.error.data.message;
          } catch (e) {
            message = err.message;
          }
          this.snackbar.open(message, 'CLOSE', {
            duration: 5000
          });
          return Observable.throw(err);
        }
      });
    // return next.handle(req);
  }
}
