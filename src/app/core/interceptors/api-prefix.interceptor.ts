import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let url = req.url;
    let headers = req.headers;
    let credential = false;
    const ct = 'Content-type';
    if (!req.url.endsWith('matchdays/current')) {
      headers = headers.set('Accept', 'application/json');
      if (!req.headers.has(ct) && req.method !== 'DELETE') {
        headers = headers.set(ct, 'application/json');
      } else if (headers.get(ct) === 'multipart/form-data') {
        headers = headers.delete(ct);
      }
      credential = true;
    } else {
      headers = headers.set('Accept', '*/*');
    }

    if (!req.url.startsWith('https://') && !req.url.startsWith('http://')) {
      url = environment.apiEndpoint + url;
    }

    return next
      .handle(
        req.clone({
          url,
          withCredentials: credential,
          headers
        })
      )
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (!req.params.has('page') || !event.body.hasOwnProperty('pagination')) {
              return event.clone({
                body: event.body.data
              });
            }
          }

          return event;
        })
      );
  }
}
