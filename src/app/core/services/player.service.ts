import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../models';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private url = 'players';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url);
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
