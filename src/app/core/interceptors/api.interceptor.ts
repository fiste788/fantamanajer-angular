import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url;

    let headers = req.headers;
    let credential = false;
    if (!req.url.endsWith('matchdays/current')) {
      headers = headers.set('Accept', 'application/json');
      if (!req.headers.has('Content-type')) {
        headers = headers.set('Content-type', 'application/json');
      } else if (headers.get('Content-Type') === 'multipart/form-data') {
        headers = headers.delete('Content-type');
      }
      credential = true;
    } else {
      headers = headers.delete('Accept');
    }

    if (!req.url.startsWith('https://') && !req.url.startsWith('http://')) {
      url = environment.apiEndpoint + url;
    }
    return next
      .handle(req.clone({
        url,
        withCredentials: credential,
        headers
      }))
      .pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!req.params.has('page') || !event.body.hasOwnProperty('pagination')) {
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
