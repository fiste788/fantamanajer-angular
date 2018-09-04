import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from './player';

@Injectable()
export class PlayerService {
  private url = 'players';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url);
  }

  getPlayer(id: number, championship_id?: number): Observable<Player> {
    let url = `${this.url}/${id}`;
    if (championship_id) {
      url += '?championship_id=' + championship_id;
    }
    return this.http.get<Player>(url);
  }
}
