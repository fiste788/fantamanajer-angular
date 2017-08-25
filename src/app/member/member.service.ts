import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Member } from './member';
import { AppConfig } from '../app.config';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class MemberService {
    private url = 'members';

    constructor(
      private config: AppConfig,
      private http: AuthHttp,
      private shared: SharedService) {
    }

    getFree(championship_id: number, role_id: number = 1): Promise<Member[]> {
      const headers = new Headers({ 'Accept': 'application/json' });
      const options = new RequestOptions({ headers: headers });
      let url = this.config.get('apiEndpoint') + 'championships/' + championship_id + '/' + this.url + '/free';
      if (role_id) {
        url = url + '/' + role_id;
      }
        return this.http.get(url, options)
            .toPromise()
            .then(response => response.json().data as Member[])
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error.json().data.message); // for demo purposes only
        return Promise.reject(error.message || error);
    }


}
