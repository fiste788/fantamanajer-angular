import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../app.config';
import { Matchday } from './matchday';

@Injectable()
export class MatchdayService {

  private matchdayUrl = 'matchdays'; // URL to web api

  constructor(private config: AppConfig, private http: Http) {}

  private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

  getMatchday(id: number): Promise<Matchday> {
        const url = `${this.config.get('apiEndpoint') + this.matchdayUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as Matchday)
            .catch(this.handleError);
    }

  getCurrentMatchday(): Promise<Matchday> {
    const headers = new Headers({ 'Accept': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const url = `${this.config.get('apiEndpoint') + this.matchdayUrl}/current`;
        return this.http.get(url, options)
            .toPromise()
            .then(response => response.json().data as Matchday)
            .catch(this.handleError);
  }
}
