import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Selection } from './selection';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../app.config';

@Injectable()
export class SelectionService {
  private url = 'selections';
  private headers = new Headers({ 'Accept': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private config: AppConfig, private http: AuthHttp) {}

  getSelection(id: number): Promise<Selection> {
    return this.http.get(this.config.get('apiEndpoint') + 'teams/' + id + '/' + this.url, this.options)
      .toPromise()
      .then(response => response.json().data as Selection)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  update(selection: Selection): Promise<any> {
        const url = this.config.get('apiEndpoint') + 'teams/' + selection.team_id + '/' + this.url + '/' + selection.id;
        return this.http
            .put(url, JSON.stringify(selection))
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    create(selection: Selection): Promise<Selection> {
        return this.http
            .post(this.config.get('apiEndpoint') + 'teams/' + selection.team_id + '/' + this.url, JSON.stringify(selection))
            .toPromise()
            .then(res => res.json().data as Selection)
            .catch(this.handleError);
    }
}
