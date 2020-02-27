import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player } from '@app/shared/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly url = 'players';

  constructor(private readonly http: HttpClient) { }

  getPlayers(): Observable<Array<Player>> {
    return this.http.get<Array<Player>>(this.url);
  }

  getPlayer(id: number, championshipId?: number): Observable<Player> {
    let params = new HttpParams();
    const url = `${this.url}/${id}`;
    if (championshipId) {
      params = params.set('championshipId', `${championshipId}`);
    }

    return this.http.get<Player>(url, { params });
  }
}
