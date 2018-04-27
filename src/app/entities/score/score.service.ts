import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Score } from './score';

@Injectable()
export class ScoreService {
  private url = 'scores';

  constructor(private http: HttpClient) { }

  getRanking(championshipId?: number): Observable<any> {
    return this.http.get(`championships/${championshipId}/ranking`);
  }

  getScore(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  getLastScore(team_id: number): Observable<any> {
    return this.http.get(`teams/${team_id}/${this.url}/last`);
  }
}
