import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Player } from './player';
import { SharedService } from 'app/shared/shared.service';

@Injectable()
export class PlayerService {
  private url = 'players';

  constructor(private http: HttpClient, private shared: SharedService) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.url);
  }

  getPlayer(id: number): Observable<Player> {
    let url = `${this.url}/${id}`;
    if (this.shared.currentChampionship) {
      url += '?championship_id=' + this.shared.currentChampionship.id;
    }
    return this.http.get<Player>(url);
  }
}
