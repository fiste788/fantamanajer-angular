import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member, Role } from '@shared/models';
import { Observable } from 'rxjs';

const url = 'members';
const routes = {
  free: (id: number) => `/championships/${id}/${url}/free`,
  best: `/${url}/best`,
  team: (id: number) => `/teams/${id}/${url}`,
  notMine: (id: number, roleId: number) => `/teams/${id}/${url}/not_mine/${roleId}`,
  club: (id: number) => `/clubs/${id}/${url}`,
  member: (id: number) => `/${url}/${id}`
};

@Injectable({ providedIn: 'root' })
export class MemberService {

  constructor(private readonly http: HttpClient) { }

  getFree(championshipId: number, roleId = 1, stats = true): Observable<Array<Member>> {
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

  getAllFree(championshipId: number): Observable<Array<Member>> {
    const params = new HttpParams().set('stats', '0');

    return this.http.get<Array<Member>>(routes.free(championshipId), { params });

  }

  getBest(): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(routes.best);
  }

  getByTeamId(teamId: number): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(routes.team(teamId));
  }

  getNotMine(teamId: number, roleId: number): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(routes.notMine(teamId, roleId));
  }

  getByClubId(clubId: number): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(routes.club(clubId));
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(routes.member(id));
  }
}
