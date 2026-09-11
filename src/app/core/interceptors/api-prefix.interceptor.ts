import { isPlatformServer } from '@angular/common';
import type { HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { HttpContext, HttpContextToken, HttpResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

import { map } from 'rxjs';

import { ENVIRONMENT } from '@env';

import type { ApiResponse } from '@data/interfaces'; // Assicurati che il percorso sia corretto

// Modifica suggerita per la nomenclatura e possibile spostamento in un file dedicato
export const SKIP_URL_PREFIX_CONTEXT = new HttpContextToken<boolean>(() => false);
export const SKIP_DEFAULT_HEADERS_CONTEXT = new HttpContextToken<boolean>(() => false);

// Funzione utility per impostare gli header predefiniti
function applyDefaultHeaders(request: HttpRequest<unknown>): HttpRequest<unknown> {
  const contentTypeHeader = 'Content-Type';
  let { headers } = request; // Utilizzo di destructuring
  const { method } = request;

  // Imposta l'header Accept se non è già presente
  if (!headers.has('Accept')) {
    headers = headers.set('Accept', 'application/json');
  }

  if (!headers.has(contentTypeHeader) && method !== 'DELETE') {
    headers = headers.set(contentTypeHeader, 'application/json');
  } else if (headers.get(contentTypeHeader) === 'multipart/form-data') {
    headers = headers.delete(contentTypeHeader);
  }

  return request.clone({
    headers,
  });
}

// Funzione utility per impostare il prefisso URL
function applyUrlPrefix(request: HttpRequest<unknown>, prefix: string): HttpRequest<unknown> {
  // Aggiungere un commento per spiegare l'esclusione delle URL /SVG (Refactoring suggerito)
  // Esclude le URL che iniziano con /SVG dall'aggiunta del prefisso API.
  const url = (request.url.startsWith('/svg') ? '' : prefix) + request.url;

  return request.clone({
    url,
  });
}

// Funzione utility per loggare il tempo della richiesta (rimossa la condizione isServer interna)
function logRequestDetails(request: HttpRequest<unknown>, response: HttpResponse<unknown>, startTime: Date): Record<string, Date | number | string> | undefined {
  if (!request.url) {
    return undefined;
  }
  const endTime: Date = new Date();
  const duration: number = endTime.valueOf() - startTime.valueOf();

  return {
    duration,
    endTime,
    method: request.method,
    params: request.params.toString(),
    requestUrl: request.url,
    // this is useful in cases of redirects
    responseUrl: response.url ?? '',
    startTime,
    // Aggiungere status code, status text, ecc. perMigliore il log più utile
    status: response.status,
  };
}

// Modifica suggerita per la nomenclatura e il refactoring
export const apiDataTransformerInterceptor: HttpInterceptorFn = (request, next) => {
  let processedRequest = request; // Modifica nomenclatura variabile
  const platformId = inject(PLATFORM_ID); // Iniettare PLATFORM_ID una sola volta
  const isServer = isPlatformServer(platformId);

  // Applica il prefisso URL se non indicato altrimenti nel contesto
  if (!request.context.get(SKIP_URL_PREFIX_CONTEXT)) {
    // Utilizzo del nome del token modificato
    processedRequest = applyUrlPrefix(processedRequest, isServer ? ENVIRONMENT.serverApiEndpoint : ENVIRONMENT.apiEndpoint);
  }

  // Applica gli header predefiniti se non indicato altrimenti nel contesto
  if (!request.context.get(SKIP_DEFAULT_HEADERS_CONTEXT)) {
    // Utilizzo del nome del token modificato
    processedRequest = applyDefaultHeaders(processedRequest);
  }

  const startTime = new Date();

  return next(processedRequest).pipe(
    // Utilizzo nomenclatura variabile
    map((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        // Logga i dettagli della richiesta solo sul server (la condizione spostata qui)
        if (isServer) {
          console.log(logRequestDetails(request, event, startTime));
        }

        const body = event.body as ApiResponse | undefined;

        // Logica per estrarre i dati dal corpo della risposta (Refactoring suggerito e commento)
        // Estrae la proprietà 'data' dal corpo della risposta API se la risposta
        // non è paginata o non contiene informazioni di paginazione, e il body non è null.
        // Questo trasforma la risposta da { data: T, pagination: P } a T o { data: T }.
        if (body && (!request.params.has('page') || body.pagination === undefined)) {
          // Se body.data esiste, restituisce un clone della risposta con body.data come nuovo body.
          // Altrimenti, restituisce un clone con body.data = undefined (se body è solo { data: undefined })
          // o il body originale se body è null o undefined (gestito dalla condizione if(body)).
          // Considerare un controllo più esplicito se body.data dovrebbe essere sempre definito qui.
          return event.clone({
            body: body.data, // Assicurati che il body.data possa essere null se appropriato
          });
        }
        // Se la risposta è paginata o non ha la struttura attesa,Migliore l'evento originale
      }

      return event;
    }),
  );
};

// Modifica suggerita per la nomenclatura della funzione helper esportata
export function skipDefaultHeaders(context?: HttpContext): HttpContext {
  return (context ?? new HttpContext()).set(SKIP_DEFAULT_HEADERS_CONTEXT, true); // Utilizzo del nome del token modificato
}

// Modifica suggerita per la nomenclatura della funzione helper esportata
export function skipUrlPrefix(context?: HttpContext): HttpContext {
  return (context ?? new HttpContext()).set(SKIP_URL_PREFIX_CONTEXT, true); // Utilizzo del nome del token modificato
}
