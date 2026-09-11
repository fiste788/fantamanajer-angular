import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { Player } from '../interfaces';

const PLAYERS_URL_SEGMENT = 'players'; // Modifica suggerita per la nomenclatura

const routes = {
  player: (id: number) => `/${PLAYERS_URL_SEGMENT}/${id}`,
  players: `/${PLAYERS_URL_SEGMENT}`,
};

@Service()
export class PlayerService {

  readonly #http = inject(HttpClient);

  public getPlayer(id: number, championshipId?: number): Observable<Player> {
    const parameters = this.#createGetPlayerParams(championshipId); // Utilizzo della funzione refactorizzata

    return this.#http.get<Player>(routes.player(id), { params: parameters });
  }

  public getPlayers(): Observable<Player[]> {
    return this.#http.get<Player[]>(routes.players);
  }

  // Funzione privata per creare HttpParams con championshipId (Refactoring suggerito)
  #createGetPlayerParams(championshipId?: number): HttpParams {
    const parameters = new HttpParams();
    if (championshipId) {
      return parameters.set('championshipId', championshipId);
    }

    return parameters;
  }

}
