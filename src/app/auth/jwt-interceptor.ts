import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';
import { environment } from '../../environments/environment';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private snackbar: MdSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const JWT = token ? `Bearer ${token}` : '';
    const data = {
      url: environment.apiEndpoint + req.url,
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: JWT
      }
    }
    req = req.clone(data);

    return next.handle(req).map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        event = event.clone({
          body: event.body.data
        });
        return event;
      }
    }).catch((err: any, caught) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 403) {
          // console.info('err.error =', err.error, ';');
        }
        this.snackbar.open(err.message, 'CLOSE', {
          duration: 5000
        });
        return Observable.throw(err);
      }
    })
    // return next.handle(req);
  }
}
