import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AtLeast, RecursivePartial } from '@app/types';

import { Team } from '../types';

const url = 'teams';
const routes = {
  create: `/${url}`,
  team: (id: number) => `/${url}/${id}`,
  teams: (id: number) => `/championships/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class TeamService {
  readonly #http = inject(HttpClient);

  public getTeams(championshipId: number): Observable<Array<Team>> {
    return this.#http.get<Array<Team>>(routes.teams(championshipId));
  }

  public getTeam(id: number): Observable<Team> {
    return this.#http.get<Team>(routes.team(id));
  }

  public update(team: AtLeast<Team, 'id'>): Observable<Pick<Team, 'id'>> {
    return this.#http.put(routes.team(team.id), team).pipe(map(() => team));
  }

  public upload(id: number, formData: FormData): Observable<Pick<Team, 'photo_url'>> {
    formData.set('_method', 'PUT');

    return this.#http.post<Pick<Team, 'photo_url'>>(routes.team(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  public create(team: RecursivePartial<Team>): Observable<Team> {
    return this.#http.post<Team>(routes.create, team);
  }
}
