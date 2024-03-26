import { isPlatformServer } from '@angular/common';
import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpRequest,
  HttpResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { map } from 'rxjs/operators';

import { ApiResponse } from '@data/types';
import { environment } from '@env';

const NO_PREFIX_IT = new HttpContextToken<boolean>(() => false);
const NO_HEADERS_IT = new HttpContextToken<boolean>(() => false);

function setPrefix(req: HttpRequest<unknown>, prefix: string): HttpRequest<unknown> {
  const url = req.url.endsWith('.svg') ? req.url : prefix + req.url;

  return req.clone({
    url,
  });
}

function setHeaders(req: HttpRequest<unknown>): HttpRequest<unknown> {
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

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  let newReq = req;
  if (!req.context.get(NO_PREFIX_IT)) {
    const isServer = isPlatformServer(inject(PLATFORM_ID));
    newReq = setPrefix(newReq, isServer ? environment.serverApiEndpoint : environment.apiEndpoint);
  }
  if (!req.context.get(NO_HEADERS_IT)) {
    newReq = setHeaders(newReq);
  }

  return next(newReq).pipe(
    map((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        const body = event.body as ApiResponse | null;
        if (body && (!req.params.has('page') || body.pagination === undefined)) {
          return event.clone({
            body: body.data,
          });
        }
      }

      return event;
    }),
  );
};
export function noHeadersIt(context?: HttpContext): HttpContext {
  return (context ?? new HttpContext()).set(NO_HEADERS_IT, true);
}

export function noPrefixIt(context?: HttpContext): HttpContext {
  return (context ?? new HttpContext()).set(NO_PREFIX_IT, true);
}
