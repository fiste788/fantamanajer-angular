import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Team } from '@shared/models';

const url = 'teams';
const routes = {
  create: `/${url}`,
  team: (id: number) => `/${url}/${id}`,
  teams: (id: number) => `/championships/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class TeamService {

  constructor(private readonly http: HttpClient) { }

  public getTeams(championshipId: number): Observable<Array<Team>> {
    return this.http.get<Array<Team>>(routes.teams(championshipId));
  }

  public getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(routes.team(id));
  }

  public update(team: Team): Observable<Pick<Team, 'id'>> {
    return this.http.put(routes.team(team.id), team)
      .pipe(map(() => team));
  }

  public upload(id: number, formData: FormData): Observable<{}> {
    formData.set('_method', 'PUT');

    return this.http.post(routes.team(id), formData, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
  }

  public create(team: Team): Observable<Team> {
    return this.http.post<Team>(routes.create, team);
  }

  public save(team: Team): Observable<Pick<Team, 'id'>> {
    if (team.id) {
      return this.update(team);
    }

    return this.create(team);

  }
}
