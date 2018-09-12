import { Injectable } from '@angular/core';
import { Team } from './team';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/shared.service';
import { Observable } from 'rxjs';

@Injectable()
export class TeamService {
  private url = 'teams';

  constructor(private http: HttpClient, private shared: SharedService) {

  }

  getTeams(championship_id: number): Observable<Team[]> {
    return this.http.get<Team[]>('championships/' + championship_id + '/' + this.url);
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.url}/${id}`);
  }

  update(team: Team): Observable<any> {
    const url = `${this.url}/${team.id}`;
    return this.http.put(url, JSON.stringify(team));
  }

  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.url, JSON.stringify(Team));
  }

  save(team: Team): Observable<any> {
    if (team.id) {
      return this.update(team);
    } else {
      return this.create(team);
    }
  }
}