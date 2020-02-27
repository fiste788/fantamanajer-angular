import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member, Role } from '@app/shared/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly url = 'members';

  constructor(private readonly http: HttpClient) { }

  getFree(championshipId: number, roleId = 1, stats = true): Observable<Array<Member>> {
    let params = new HttpParams();
    let url = `championships/${championshipId}/${this.url}/free`;
    if (roleId) {
      url = `${url}/${roleId}`;
    }
    if (!stats) {
      params = params.set('stats', '0');
    }

    return this.http.get<Array<Member>>(url, { params });

  }

  getAllFree(championshipId: number): Observable<Array<Member>> {
    const params = new HttpParams().set('stats', '0');
    const url = `championships/${championshipId}/${this.url}/free`;

    return this.http.get<Array<Member>>(url, { params });

  }

  getBest(): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(`${this.url}/best`);
  }

  getByTeamId(teamId: number): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(`teams/${teamId}/${this.url}`);
  }

  getNotMine(teamId: number, roleId: number): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(`teams/${teamId}/${this.url}/not_mine/${roleId}`);
  }

  getByClubId(clubId: number): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(`clubs/${clubId}/${this.url}`);
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.url}/${id}`);
  }
}
