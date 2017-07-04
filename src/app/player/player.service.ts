import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Player } from './player';
import { AppConfig } from '../app.config';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class PlayerService {
    private playersUrl = 'players';

    constructor(
      private config: AppConfig,
      private http: Http,
      private shared: SharedService) {
    }

    getPlayers(): Promise<Player[]> {
      const headers = new Headers({ 'Accept': 'application/json' });
      const options = new RequestOptions({ headers: headers });
        return this.http.get(this.config.get('apiEndpoint') + this.playersUrl, options)
            .toPromise()
            .then(response => response.json().data as Player[])
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error.json().data.message); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getPlayer(id: number): Promise<Player> {
        const url = this.config.get('apiEndpoint') + `${this.playersUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as Player)
            .catch(this.handleError);
    }

}
