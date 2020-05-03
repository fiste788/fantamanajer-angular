import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CamelcaseInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        map((event: HttpEvent<{}>) => {
          if (event instanceof HttpResponse) {
            if (event.body !== null) {
              return event.clone({
                body: this.keysToCamel(event.body)
              });
            }
          }

          return event;
        })
      );
  }

  toCamel(s: string): string {
    return s.replace(/([-_][a-z])/ig, $1 =>
      $1.toUpperCase()
        .replace('-', '')
        .replace('_', ''));
  }

  keysToCamel(o: {}): unknown {
    if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
      const n = {};
      Object.keys(o)
        .forEach(k => {
          n[this.toCamel(k)] = this.keysToCamel(o[k]);
        });

      return n;
    } else if (Array.isArray(o)) {
      return o.map(i =>
        this.keysToCamel(i));
    }

    return o;
  }
}
