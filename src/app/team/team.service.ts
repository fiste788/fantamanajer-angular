import { Injectable } from '@angular/core';
import { Team } from './team';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TeamService {
  private url = 'teams';

  constructor(private http: HttpClient, private shared: SharedService) {
    this.url =
      'championships/' + this.shared.currentChampionship.id + '/' + this.url;
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.url);
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.url}/${id}`);
  }
}
