import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Member, Role } from '@shared/models';

const url = 'members';
const routes = {
  best: `/${url}/best`,
  club: (id: number) => `/clubs/${id}/${url}`,
  free: (id: number) => `/championships/${id}/${url}/free`,
  member: (id: number) => `/${url}/${id}`,
  notMine: (id: number, roleId: number) => `/teams/${id}/${url}/not_mine/${roleId}`,
  team: (id: number) => `/teams/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class MemberService {

  constructor(private readonly http: HttpClient) { }

  public getFree(championshipId: number, roleId = 1, stats = true): Observable<Array<Member>> {
    let params = new HttpParams();
    let murl = routes.free(championshipId);
    if (roleId) {
      murl = `${murl}/${roleId}`;
    }
    if (!stats) {
      params = params.set('stats', '0');
    }

    return this.http.get<Array<Member>>(murl, { params });

  }

  public getAllFree(championshipId: number): Observable<{ [id: number]: Array<Member> }> {
    const params = new HttpParams().set('stats', '0');

    return this.http.get<{ [id: number]: Array<Member> }>(routes.free(championshipId), { params });

  }

  public getBest(): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(routes.best);
  }

  public getByTeamId(teamId: number): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(routes.team(teamId));
  }

  public getNotMine(teamId: number, roleId: number): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(routes.notMine(teamId, roleId));
  }

  public getByClubId(clubId: number): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(routes.club(clubId));
  }

  public getById(id: number): Observable<Member> {
    return this.http.get<Member>(routes.member(id));
  }
}
