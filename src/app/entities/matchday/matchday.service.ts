import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matchday } from './matchday';

@Injectable()
export class MatchdayService {
  private url = 'matchdays'; // URL to web api

  constructor(private http: HttpClient) { }

  getMatchday(id: number): Observable<Matchday> {
    return this.http.get<Matchday>(`${this.url}/${id}`);
  }

  getCurrentMatchday(): Observable<Matchday> {
    return this.http.get<Matchday>(`${this.url}/current`);
  }
}
