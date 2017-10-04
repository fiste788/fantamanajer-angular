import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { SharedService } from '../shared/shared.service';
import { Score } from './score';

@Injectable()
export class ScoreService {
  private url = 'scores';

  constructor(
    private http: HttpClient,
    private shared: SharedService) {

  }

  getRanking(): Promise<any> {
      const rankingUrl = `championships/${this.shared.currentChampionship.id}/ranking`;
        return this.http.get(rankingUrl)
            .toPromise()
    }

    getRanking2(): Observable<any> {
      const rankingUrl = `championships/${this.shared.currentChampionship.id}/ranking`;
        return this.http.get(rankingUrl)
          .map(response => response['ranking'])
          .concatMap(arr => Observable.from(arr))
          .toArray();
            // ._catch(this.handleError);
    }

    getScore(id: number): Promise<any> {
        const url = `${this.url}/${id}`;
        return this.http.get(url)
            .toPromise();
    }

    getLastScore(team_id: number): Promise<any> {
        const url = `teams/${team_id}/${this.url}/last`;
        return this.http.get(url)
            .toPromise()
    }

}
