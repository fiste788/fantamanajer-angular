import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Matchday } from '@app/shared/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MatchdayService {
  private readonly url = 'matchdays'; // URL to web api

  constructor(private readonly http: HttpClient) { }

  getMatchday(id: number): Observable<Matchday> {
    return this.http.get<Matchday>(`${this.url}/${id}`);
  }

  getCurrentMatchday(): Observable<Matchday> {
    return this.http.get<Matchday>(`${this.url}/current`, {
      withCredentials: false
    });
  }
}
