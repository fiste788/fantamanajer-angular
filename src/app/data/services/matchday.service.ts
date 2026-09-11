import type { HttpContext, HttpResourceRef } from '@angular/common/http';
import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http'; // Importare HttpContext
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import { skipErrorHandling } from '@app/errors/http-error.interceptor';
import { skipAuthInterceptor, skipDefaultHeaders } from '@app/interceptors';

import type { Matchday } from '../interfaces';

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

@Service()
export class MatchdayService {

  readonly #http = inject(HttpClient);

  public getCurrentMatchday(): Observable<Matchday> {
    return this.#http.get<Matchday>(routes.current, this.#getRequestOptions()); // Utilizzo della funzione refactorizzata
  }

  public getCurrentMatchdayResource(): HttpResourceRef<Matchday | undefined> {
    return httpResource(
      () => ({
        url: routes.current,
        ...this.#getRequestOptions(), // Utilizzo della funzione refactorizzata
      }),
      { equal: (a, b) => a.id === b.id },
    );
  }

  #getHackyHttpHeaders(): HackyHttpHeaders {
    // Il metodo ora restituisce un'istanza della classe definita esternamente
    // Commento per spiegare il motivo di questa implementazione specifica
    // Questa implementazione aggira il comportamento di HttpClient che tenta di impostare un Accept header predefinito.
    return new HackyHttpHeaders();
  }

  // Funzione privata perMigliore il contesto e gli headers HTTP comuni (Refactoring suggerito)
  #getRequestOptions(): {
    context: HttpContext;
    headers: HttpHeaders;
    withCredentials: false;
  } {
    return {
      context: skipErrorHandling(skipAuthInterceptor(skipDefaultHeaders())),
      headers: this.#getHackyHttpHeaders(),
      withCredentials: false,
    };
  }

}
