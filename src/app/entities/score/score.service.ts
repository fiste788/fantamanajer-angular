import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Score } from './score';
import { Lineup } from '../lineup/lineup';

@Injectable()
export class ScoreService {
  private url = 'scores';

  constructor(private http: HttpClient) { }

  getRanking(championshipId?: number): Observable<any> {
    return this.http.get(`championships/${championshipId}/ranking`);
  }

  getScore(id: number, members = false): Observable<any> {
    let params;
    if (members) {
      params = new HttpParams().set('members', '1');
    }
    return this.http.get(`${this.url}/${id}`, { params: params });
  }

  getLastScore(team_id: number): Observable<any> {
    return this.http.get(`teams/${team_id}/${this.url}/last`);
  }

  getScoresByTeam(team_id: number): Observable<Score[]> {
    return this.http.get<Score[]>(`teams/${team_id}/${this.url}`);
  }

  update(score: Score): Observable<any> {
    const url = `${this.url}/${score.id}`;
    return this.http.put(url, JSON.stringify(this.cleanScore(score)));
  }

  private cleanScore(score: Score): Score {
    const newScore: Score = JSON.parse(JSON.stringify(score));
    newScore.lineup.dispositions = newScore.lineup.dispositions.filter(
      value => value.member_id
    );
    newScore.lineup.dispositions.map(disp => delete disp.member);
    delete newScore.lineup.team;
    delete newScore.team;
    delete newScore.lineup.modules;
    delete newScore.lineup.module_object;
    return newScore;
  }
}
