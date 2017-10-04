import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Member } from './member';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MemberService {
    private url = 'members';

    constructor(private http: HttpClient) {
    }

    getFree(championship_id: number, role_id: number = 1): Promise<Member[]> {
      let url = 'championships/' + championship_id + '/' + this.url + '/free';
      if (role_id) {
        url = url + '/' + role_id;
      }
      return this.http.get<Member[]>(url)
        .toPromise().catch();
    }
}
