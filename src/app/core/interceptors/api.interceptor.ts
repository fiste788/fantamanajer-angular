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
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url;
    if (!req.url.startsWith('https://') && !req.url.startsWith('http://')) {
      url = environment.apiEndpoint + url;
    }
    const data = {
      url: url
    };
    return next
      .handle(req.clone(data))
      .pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!req.params.has('page')) {
            event = event.clone({
              body: event.body.data
            });
          }
          return event;
        }
      })
      );
  }
}
