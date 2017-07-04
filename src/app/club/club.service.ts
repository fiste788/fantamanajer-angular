import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Club } from './club';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../app.config';

@Injectable()
export class ClubService {
  private clubsUrl = 'clubs';
  private headers = new Headers({ 'Accept': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private config: AppConfig, private http: AuthHttp) {}


  getClubs(): Promise<Club[]> {
    return this.http.get(this.config.get('apiEndpoint') + this.clubsUrl, this.options)
      .toPromise()
      .then(response => response.json().data as Club[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


  getClub(id: number): Promise<Club> {
    const url = `${this.config.get('apiEndpoint') + this.clubsUrl}/${id}`;
    return this.http.get(url, this.options)
      .toPromise()
      .then(response => response.json().data as Club)
      .catch(this.handleError);
  }
}
