import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Score } from '@shared/models';

const url = 'scores';
const routes = {
  ranking: (id: number) => `/championships/${id}/ranking`,
  score: (id: number) => `/${url}/${id}`,
  team: (id: number) => `/teams/${id}/${url}`,
  update: (id: number) => `/${url}/${id}`
};

@Injectable({ providedIn: 'root' })
export class ScoreService {

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

  getRanking(championshipId: number): Observable<any> {
    return this.http.get(routes.ranking(championshipId));
  }

  getScore(id: number, members = false): Observable<Score> {
    let params = new HttpParams();
    if (members) {
      params = params.set('members', '1');
    }

    return this.http.get<Score>(routes.score(id), { params });
  }

  getLastScore(teamId: number): Observable<Score> {
    return this.http.get<Score>(`${routes.team(teamId)}/last`);
  }

  getScoresByTeam(teamId: number): Observable<Array<Score>> {
    return this.http.get<Array<Score>>(routes.team(teamId));
  }

  update(score: Score): Observable<any> {
    return this.http.put(routes.update(score.id), ScoreService.cleanScore(score));
  }
}
