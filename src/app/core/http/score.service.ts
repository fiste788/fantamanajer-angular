import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Score } from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly url = 'scores';

  static cleanScore(score: Score): Score {
    const newScore: Score = JSON.parse(JSON.stringify(score));
    newScore.lineup.dispositions = newScore.lineup.dispositions.filter(
      value => value.member_id !== null
    );
    newScore.lineup.dispositions.map(disp => delete disp.member);
    delete newScore.lineup.team;
    delete newScore.team;
    delete newScore.lineup.modules;
    delete newScore.lineup.module_object;

    return newScore;
  }

  constructor(private readonly http: HttpClient) { }

  getRanking(championshipId?: number): Observable<any> {
    return this.http.get(`championships/${championshipId}/ranking`);
  }

  getScore(id: number, members = false): Observable<Score> {
    let params = new HttpParams();
    if (members) {
      params = params.set('members', '1');
    }

    return this.http.get<Score>(`${this.url}/${id}`, { params });
  }

  getLastScore(teamId: number): Observable<Score> {
    return this.http.get<Score>(`teams/${teamId}/${this.url}/last`);
  }

  getScoresByTeam(teamId: number): Observable<Array<Score>> {
    return this.http.get<Array<Score>>(`teams/${teamId}/${this.url}`);
  }

  update(score: Score): Observable<any> {
    const url = `${this.url}/${score.id}`;

    return this.http.put(url, JSON.stringify(ScoreService.cleanScore(score)));
  }
}
