import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Team } from '@shared/models';

const url = 'teams';
const routes = {
  teams: (id: number) => `/championships/${id}/${url}`,
  team: (id: number) => `/${url}/${id}`,
  create: `/${url}`
};

@Injectable({ providedIn: 'root' })
export class TeamService {

  constructor(private readonly http: HttpClient) { }

  getTeams(championshipId: number): Observable<Array<Team>> {
    return this.http.get<Array<Team>>(routes.teams(championshipId));
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(routes.team(id));
  }

  update(team: Team): Observable<any> {
    return this.http.put(routes.team(team.id), team);
  }

  upload(id: number, formData: FormData): Observable<any> {
    formData.set('_method', 'PUT');

    return this.http.post(routes.team(id), formData, {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    });
  }

  create(team: Team): Observable<Team> {
    return this.http.post<Team>(routes.create, team);
  }

  save(team: Team): Observable<any> {
    if (team.id) {
      return this.update(team);
    }

    return this.create(team);

  }
}
