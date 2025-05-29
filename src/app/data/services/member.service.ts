import { HttpClient, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Matchday, Member, Role } from '../types';

const url = 'members';
const routes = {
  best: (id: number) => `/${url}/matchdays/${id}/best`,
  club: (id: number) => `/clubs/${id}/${url}`,
  free: (id: number) => `/championships/${id}/${url}/free`,
  freeByRole: (id: number, role: number) => `/championships/${id}/${url}/free/${role}`,
  member: (id: number) => `/${url}/${id}`,
  notMine: (id: number, roleId: number) => `/teams/${id}/${url}/not_mine/${roleId}`,
  team: (id: number) => `/teams/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class MemberService {
  readonly #http = inject(HttpClient);

  public getByClubIdResource(clubId: () => number): HttpResourceRef<Array<Member> | undefined> {
    return httpResource(() => routes.club(clubId()));
  }

  public getFree(championshipId: number, roleId = 1, stats = true): Observable<Array<Member>> {
    let params = new HttpParams();
    if (!stats) {
      params = params.set('stats', '0');
    }
    const path = roleId ? routes.freeByRole(championshipId, roleId) : routes.free(championshipId);

    return this.#http.get<Array<Member>>(path, { params });
  }

  public getAllFree(championshipId: number): Observable<Record<Role['id'], Array<Member>>> {
    const params = new HttpParams().set('stats', '0');

    return this.#http.get<Record<Role['id'], Array<Member>>>(routes.free(championshipId), {
      params,
    });
  }

  public getBestResource(matchday: () => Matchday | undefined): HttpResourceRef<Array<Member>> {
    return httpResource(
      () => (matchday() ? `/${url}/matchdays/${matchday()!.id - 1}/best` : undefined),
      { defaultValue: [] },
    );
  }

  public getBest(matchdayId: number): Observable<Array<Member>> {
    return this.#http.get<Array<Member>>(routes.best(matchdayId));
  }

  public getByTeamId(teamId: number): Observable<Array<Member>> {
    return this.#http.get<Array<Member>>(routes.team(teamId));
  }

  public getNotMine(teamId: number, roleId: number): Observable<Array<Member>> {
    return this.#http.get<Array<Member>>(routes.notMine(teamId, roleId));
  }

  public getByClubId(clubId: number): Observable<Array<Member>> {
    return this.#http.get<Array<Member>>(routes.club(clubId));
  }

  public getById(id: number): Observable<Member> {
    return this.#http.get<Member>(routes.member(id));
  }
}
