import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Player } from './player';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class PlayerService {
    private url = 'players';

    constructor(
      private http: HttpClient,
      private shared: SharedService) {
    }

    getPlayers(): Promise<Player[]> {
        return this.http.get<Player[]>(this.url)
            .toPromise()
    }

    getPlayer(id: number): Promise<Player> {
        let url = `${this.url}/${id}`;
        if (this.shared.currentChampionship) {
          url += '?championship_id=' + this.shared.currentChampionship.id;
        }
        return this.http.get<Player>(url)
            .toPromise()
    }

}
