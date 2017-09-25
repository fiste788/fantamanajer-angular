import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Lineup } from './lineup';
import { Member } from '../member/member';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../app.config';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class LineupService {
    private url = 'lineups';
    private headers = new Headers({ 'Accept': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private config: AppConfig,
          private route: ActivatedRoute,
          private http: AuthHttp,
          private shared: SharedService) {}


    getLineup(team_id): Promise<{members: Member[], lineup: Lineup, modules: string[]}> {
      const url = this.config.get('apiEndpoint') + `teams/${team_id}/${this.url}/current`;
      return this.http.get(url, this.options)
            .toPromise()
            .then(response => response.json().data as {members: Member[], lineup: Lineup, modules: string[]})
            .catch(this.shared.handleError);
    }

  update(lineup: Lineup): Promise<any> {
      const url = this.config.get('apiEndpoint') + `teams/${lineup.team_id}/${this.url}/` + lineup.id;
      return this.http
          .put(url, JSON.stringify(lineup))
          .toPromise()
          .then(response => response.json())
          .catch(this.shared.handleError);
  }

  create(lineup: Lineup): Promise<Lineup> {
      return this.http
          .post(this.config.get('apiEndpoint') + `teams/${lineup.team_id}/${this.url}`, JSON.stringify(lineup), this.options)
          .toPromise()
          .then(res => res.json().data as Lineup)
          .catch(this.shared.handleError);
  }

}
