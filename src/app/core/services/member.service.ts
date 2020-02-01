import { Injectable } from '@angular/core';
import { Member, Role } from '../models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private url = 'members';

  constructor(private http: HttpClient) { }

  getFree(championshipId: number, roleId: number = 1, stats: boolean = true): Observable<Member[]> {
    let params = new HttpParams();
    let url = `championships/${championshipId}/${this.url}/free`;
    if (roleId) {
      url = url + `/${roleId}`;
    }
    if (!stats) {
      params = params.set('stats', '0');
    }
    return this.http.get<Member[]>(url, { params });

  }

  getAllFree(championshipId: number): Observable<Member[]> {
    const params = new HttpParams().set('stats', '0');
    const url = `championships/${championshipId}/${this.url}/free`;

    return this.http.get<Member[]>(url, { params });

  }

  getBest(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.url}/best`);
  }

  getByTeamId(teamId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`teams/${teamId}/${this.url}`);
  }

  getNotMine(teamId: number, roleId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`teams/${teamId}/${this.url}/not_mine/${roleId}`);
  }

  getByClubId(clubId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`clubs/${clubId}/${this.url}`);
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.url}/${id}`);
  }
}
