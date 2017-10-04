import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { SharedService } from '../shared/shared.service';
import { Matchday } from './matchday';

@Injectable()
export class MatchdayService {

  private url = 'matchdays'; // URL to web api

  constructor(private http: HttpClient) {}

  getMatchday(id: number): Promise<Matchday> {
        const url = `${this.url}/${id}`;
        return this.http.get<Matchday>(url)
            .toPromise()
            // .catch(this.shared.handleError);
    }

  getCurrentMatchday(): Promise<Matchday> {
    const url = `${this.url}/current`;
        return this.http.get<Matchday>(url)
            .toPromise()
            // .catch(this.shared.handleError);
  }
}
