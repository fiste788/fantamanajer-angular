import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Team } from './team';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../app.config';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class TeamService {
  private teamsUrl = 'teams';

  constructor(
    private config: AppConfig,
    private http: AuthHttp,
    private shared: SharedService) {
    this.teamsUrl = `${this.config.get('apiEndpoint') + 'championships/' + this.shared.currentChampionship.id}/teams`;
  }

  getTeams(): Promise<Team[]> {
    const headers = new Headers({ 'Accept': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.teamsUrl, options)
      .toPromise()
      .then(response => response.json().data as Team[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error.json().data.message); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getTeam(id: number): Promise<Team> {
    const url = `${this.teamsUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Team)
      .catch(this.handleError);
  }

}
