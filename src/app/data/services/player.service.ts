import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Player } from '../types';

const PLAYERS_URL_SEGMENT = 'players'; // Modifica suggerita per la nomenclatura

const routes = {
  player: (id: number) => `/${PLAYERS_URL_SEGMENT}/${id}`,
  players: `/${PLAYERS_URL_SEGMENT}`,
};

@Injectable({ providedIn: 'root' })
export class PlayerService {
  readonly #http = inject(HttpClient);

  public getPlayers(): Observable<Array<Player>> {
    return this.#http.get<Array<Player>>(routes.players);
  }

  public getPlayer(id: number, championshipId?: number): Observable<Player> {
    const params = this.#createGetPlayerParams(championshipId); // Utilizzo della funzione refactorizzata

    return this.#http.get<Player>(routes.player(id), { params });
  }

  // Funzione privata per creare HttpParams con championshipId (Refactoring suggerito)
  #createGetPlayerParams(championshipId?: number): HttpParams | undefined {
    if (championshipId) {
      return new HttpParams().set('championshipId', `${championshipId}`);
    }

    return undefined;
  }
}
