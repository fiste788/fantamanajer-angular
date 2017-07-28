import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Transfert } from './transfert';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../app.config';

@Injectable()
export class TransfertService {
  private url = 'transferts';
  private headers = new Headers({ 'Accept': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private config: AppConfig, private http: AuthHttp) {}


  getTransfert(id: number): Promise<Transfert[]> {
    return this.http.get(this.config.get('apiEndpoint') + 'teams/' + id + '/' + this.url, this.options)
      .toPromise()
      .then(response => response.json().data as Transfert[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
