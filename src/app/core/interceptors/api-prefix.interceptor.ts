import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env';

const NO_PREFIX_IT = new HttpContextToken<boolean>(() => false);
const NO_HEADERS_IT = new HttpContextToken<boolean>(() => false);

export function noPrefixIt(context?: HttpContext): HttpContext {
  return (context ?? new HttpContext()).set(NO_PREFIX_IT, true);
}
export function noHeadersIt(context?: HttpContext): HttpContext {
  return (context ?? new HttpContext()).set(NO_HEADERS_IT, true);
}

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let newReq = req;
    if (!req.context.get(NO_PREFIX_IT)) {
      newReq = this.prefix(newReq);
    }
    if (!req.context.get(NO_HEADERS_IT)) {
      newReq = this.headers(newReq);
    }

    return next.handle(newReq).pipe(
      map((event: HttpEvent<{ data: Record<string, unknown>; success: boolean }>) => {
        if (
          event instanceof HttpResponse &&
          event.body !== null &&
          (!req.params.has('page') || !Object.keys(event.body).includes('pagination'))
        ) {
          return event.clone({
            body: event.body.data,
          });
        }

        return event;
      }),
    );
  }

  private prefix(req: HttpRequest<unknown>): HttpRequest<unknown> {
    const url = req.url.startsWith('../') ? req.url : environment.apiEndpoint + req.url;

    return req.clone({
      url,
    });
  }

  private headers(req: HttpRequest<unknown>): HttpRequest<unknown> {
    const ct = 'Content-Type';
    let { headers } = req;
    const { method } = req;

    if (!headers.has('Accept')) {
      headers = headers.set('Accept', 'application/json');
    }

    if (!headers.has(ct) && method !== 'DELETE') {
      headers = headers.set(ct, 'application/json');
    } else if (headers.get(ct) === 'multipart/form-data') {
      headers = headers.delete(ct);
    }

    return req.clone({
      headers,
    });
  }
}

export const apiPrefixInterceptorProvider: Provider = {
  multi: true,
  provide: HTTP_INTERCEPTORS,
  useClass: ApiPrefixInterceptor,
};
