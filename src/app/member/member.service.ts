import { Injectable } from '@angular/core';
import { Member } from './member';
import { Role } from '../role/role';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MemberService {
  private url = 'members';

  constructor(private http: HttpClient) {}

  getFree(championship_id: number, role_id: number = 1): Observable<Member[]> {
    let url = 'championships/' + championship_id + '/' + this.url + '/free';
    if (role_id) {
      url = url + '/' + role_id;
    }
    return this.http.get<Member[]>(url);
  }

  getBest(): Observable<Role[]> {
    return this.http.get<Role[]>('members/best');
  }
}
