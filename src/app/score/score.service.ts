import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppConfig } from '../app.config';
import { SharedService } from '../shared/shared.service';
import { Score } from './score';

@Injectable()
export class ScoreService {
  private scoresUrl = 'scores';
  private options: RequestOptions;

  constructor(
    private config: AppConfig,
    private http: Http,
    private shared: SharedService) {
      const headers = new Headers({ 'Accept': 'application/json' });
      this.options = new RequestOptions({ headers: headers });
  }

  getRanking(): Promise<any> {
      const rankingUrl = `${this.config.get('apiEndpoint') + 'championships/' + this.shared.currentChampionship.id}/ranking`;
        return this.http.get(rankingUrl, this.options)
            .toPromise()
            .then(response => response.json().data)
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error.json().data.message); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getScore(id: number): Promise<any> {
        const url = this.config.get('apiEndpoint') + `${this.scoresUrl}/${id}`;
        return this.http.get(url, this.options)
            .toPromise()
            .then(response => response.json().data as Score)
            .catch(this.handleError);
    }

    getLastScore(team_id: number): Promise<any> {
        const url = this.config.get('apiEndpoint') + `championships/1/teams/${team_id}/${this.scoresUrl}/last`;
        return this.http.get(url, this.options)
            .toPromise()
            .then(response => response.json().data as Score)
            .catch(this.handleError);
    }

}
