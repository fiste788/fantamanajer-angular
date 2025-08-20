import {
  HttpClient,
  HttpHeaders,
  httpResource,
  HttpResourceRef,
  HttpContext,
} from '@angular/common/http'; // Importare HttpContext
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { skipErrorHandling } from '@app/errors/http-error.interceptor';
import { skipAuthInterceptor, skipDefaultHeaders } from '@app/interceptors';

import { Matchday } from '../types';

const MATCHDAYS_URL_SEGMENT = 'matchdays'; // Modifica suggerita per la nomenclatura

const routes = {
  current: `/${MATCHDAYS_URL_SEGMENT}/current`,
};

// Spostamento della classe HackyHttpHeaders fuori dal metodo (Refactoring suggerito)
class HackyHttpHeaders extends HttpHeaders {
  public override has(name: string): boolean {
    // Pretend the `Accept` header is set, so `HttpClient` will not try to set the default value.
    return name.toLowerCase() === 'accept' ? true : super.has(name);
  }
}

@Injectable({ providedIn: 'root' })
export class MatchdayService {
  readonly #http = inject(HttpClient);

  public getCurrentMatchdayResource(): HttpResourceRef<Matchday | undefined> {
    return httpResource(
      () => ({
        url: routes.current,
        ...this.#getRequestOptions(), // Utilizzo della funzione refactorizzata
      }),
      { equal: (a, b) => a?.id === b?.id },
    );
  }

  public getCurrentMatchday(): Observable<Matchday> {
    return this.#http.get<Matchday>(routes.current, this.#getRequestOptions()); // Utilizzo della funzione refactorizzata
  }

  #getHackyHttpHeaders(): HackyHttpHeaders {
    // Il metodo ora restituisce un'istanza della classe definita esternamente
    // Commento per spiegare il motivo di questa implementazione specifica
    // Questa implementazione aggira il comportamento di HttpClient che tenta di impostare un Accept header predefinito.
    return new HackyHttpHeaders();
  }

  // Funzione privata perMigliore il contesto e gli headers HTTP comuni (Refactoring suggerito)
  #getRequestOptions(): {
    headers: HttpHeaders;
    context: HttpContext;
    withCredentials: false;
  } {
    return {
      headers: this.#getHackyHttpHeaders(),
      context: skipErrorHandling(skipAuthInterceptor(skipDefaultHeaders())),
      withCredentials: false,
    };
  }
}
