import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Player } from '@shared/models';

const url = 'players';
const routes = {
  players: `/${url}`,
  player: (id: number) => `/${url}/${id}`
};

@Injectable({ providedIn: 'root' })
export class PlayerService {

  constructor(private readonly http: HttpClient) { }

  getPlayers(): Observable<Array<Player>> {
    return this.http.get<Array<Player>>(routes.players);
  }

  getPlayer(id: number, championshipId?: number): Observable<Player> {
    let params = new HttpParams();
    if (championshipId) {
      params = params.set('championshipId', `${championshipId}`);
    }

    return this.http.get<Player>(routes.player(id), { params });
  }
}
