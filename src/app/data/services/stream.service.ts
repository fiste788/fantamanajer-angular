import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import type { ResourceRef } from '@angular/core';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { Stream } from '../interfaces';

const STREAM_URL_SEGMENT = 'stream'; // Modifica suggerita per la nomenclatura

const routes = {
  championshipStream: (id: number) => `/championships/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  clubStream: (id: number) => `/clubs/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  streamByContextAndId: (context: string, id: number) => `/${context}/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  teamStream: (id: number) => `/teams/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  userStream: (id: number) => `/users/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
};

@Service()
export class StreamService {

  readonly #http = inject(HttpClient);

  // Refactoring: i metodi getBy... utilizzano internamente find
  public getChampionshipStream(championshipId: number, page = 1): Observable<Stream> {
    // Modifica suggerita per la nomenclatura
    return this.getStreamByContextAndId('championships', championshipId, page); // Utilizzo del metodo refactorizzato
  }

  public getClubStream(clubId: number, page = 1): Observable<Stream> {
    // Modifica suggerita per la nomenclatura
    return this.getStreamByContextAndId('clubs', clubId, page); // Utilizzo del metodo refactorizzato
  }

  // Modifica suggerita per la nomenclatura e utilizzo della funzione refactorizzata
  public getStreamByContextAndId(context: 'championships' | 'clubs' | 'teams' | 'users', id: number, page = 1): Observable<Stream> {
    const parameters = this.#createPaginationParams(page); // Utilizzo della funzione refactorizzata

    return this.#http.get<Stream>(routes.streamByContextAndId(context, id), { params: parameters }); // Utilizzo del nome della rotta modificato
  }

  public getStreamResourceByContextAndId(
    context: () => 'championships' | 'clubs' | 'teams' | 'users',
    id: () => number,
    page: () => number,
  ): ResourceRef<Stream | undefined> {
    return httpResource(() => ({
      params: this.#createPaginationParams(page()),
      url: routes.streamByContextAndId(context(), id()),
    }));
  }

  public getTeamStream(teamId: number, page = 1): Observable<Stream> {
    // Modifica suggerita per la nomenclatura
    return this.getStreamByContextAndId('teams', teamId, page); // Utilizzo del metodo refactorizzato
  }

  public getUserStream(userId: number, page = 1): Observable<Stream> {
    // Modifica suggerita per la nomenclatura
    return this.getStreamByContextAndId('users', userId, page); // Utilizzo del metodo refactorizzato
  }

  // Funzione privata per creare HttpParams con paginazione (Refactoring suggerito)
  #createPaginationParams(page: number): HttpParams {
    const parameters = new HttpParams();
    parameters.set('page', page);
    return parameters;
  }

}
