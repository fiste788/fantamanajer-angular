import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Stream } from '../types';

const STREAM_URL_SEGMENT = 'stream'; // Modifica suggerita per la nomenclatura

const routes = {
  championshipStream: (id: number) => `/championships/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  clubStream: (id: number) => `/clubs/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  teamStream: (id: number) => `/teams/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  userStream: (id: number) => `/users/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  streamByContextAndId: (context: string, id: number) => `/${context}/${id}/${STREAM_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
};

@Injectable({ providedIn: 'root' })
export class StreamService {
  readonly #http = inject(HttpClient);

  // Funzione privata per creare HttpParams con paginazione (Refactoring suggerito)
  private createPaginationParams(page: number): HttpParams {
    return new HttpParams().set('page', `${page}`);
  }

  // Refactoring: i metodi getBy... utilizzano internamente find
  public getChampionshipStream(championshipId: number, page = 1): Observable<Stream> { // Modifica suggerita per la nomenclatura
    return this.getStreamByContextAndId('championships', championshipId, page); // Utilizzo del metodo refactorizzato
  }

  public getTeamStream(teamId: number, page = 1): Observable<Stream> { // Modifica suggerita per la nomenclatura
    return this.getStreamByContextAndId('teams', teamId, page); // Utilizzo del metodo refactorizzato
  }

  public getClubStream(clubId: number, page = 1): Observable<Stream> { // Modifica suggerita per la nomenclatura
    return this.getStreamByContextAndId('clubs', clubId, page); // Utilizzo del metodo refactorizzato
  }

  public getUserStream(userId: number, page = 1): Observable<Stream> { // Modifica suggerita per la nomenclatura
    return this.getStreamByContextAndId('users', userId, page); // Utilizzo del metodo refactorizzato
  }

  // Modifica suggerita per la nomenclatura e utilizzo della funzione refactorizzata
  public getStreamByContextAndId(
    context: 'championships' | 'clubs' | 'teams' | 'users',
    id: number,
    page = 1,
  ): Observable<Stream> {
    const params = this.createPaginationParams(page); // Utilizzo della funzione refactorizzata
    return this.#http.get<Stream>(routes.streamByContextAndId(context, id), { params }); // Utilizzo del nome della rotta modificato
  }
}
