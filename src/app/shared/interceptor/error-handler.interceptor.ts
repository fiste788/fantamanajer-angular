import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private snackbar: MatSnackBar) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(req)
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
