import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Team } from './team';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class TeamService {
  private url = 'teams';

  constructor(
    private http: HttpClient,
    private shared: SharedService) {
      this.url = 'championships/' + this.shared.currentChampionship.id + '/' + this.url;
  }

  getTeams(): Promise<Team[]> {
    return this.http.get<Team[]>(this.url)
      .toPromise()
  }

  getTeam(id: number): Promise<Team> {
    const url = `${this.url}/${id}`;
    return this.http.get<Team>(url)
      .toPromise()
  }

}
