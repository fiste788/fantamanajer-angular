import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RecursivePartial } from '@app/types/recursive-partial.type';
import { Score, Team } from '@shared/models';

const url = 'scores';
const routes = {
  ranking: (id: number) => `/championships/${id}/ranking`,
  score: (id: number) => `/${url}/${id}`,
  team: (id: number) => `/teams/${id}/${url}`,
  update: (id: number) => `/${url}/${id}`,
};

export interface IRankingPosition {
  scores?: {
    [key: number]: Partial<Score>,
  };
  sum_points: number;
  team: Team;
  tem_id: number;
}

@Injectable({ providedIn: 'root' })
export class ScoreService {

  public static cleanScore(score: Score): RecursivePartial<Score> {
    const newScore: RecursivePartial<Score> = JSON.parse(JSON.stringify(score));
    const disp = score.lineup.dispositions.filter((value) => value.member_id !== null);
    disp.forEach((d) => { d.member = null; });
    if (newScore.lineup) {
      newScore.lineup.dispositions = disp;
      delete newScore.lineup.modules;
      delete newScore.team;
    }

    delete newScore.team;

    return newScore;
  }

  constructor(private readonly http: HttpClient) { }

  public getRanking(championshipId: number): Observable<Array<IRankingPosition>> {
    return this.http.get<Array<IRankingPosition>>(routes.ranking(championshipId));
  }

  public getScore(id: number, members = false): Observable<Score> {
    let params = new HttpParams();
    if (members) {
      params = params.set('members', '1');
    }

    return this.http.get<Score>(routes.score(id), { params });
  }

  public getLastScore(teamId: number): Observable<Score> {
    return this.http.get<Score>(`${routes.team(teamId)}/last`);
  }

  public getScoresByTeam(teamId: number): Observable<Array<Score>> {
    return this.http.get<Array<Score>>(routes.team(teamId));
  }

  public update(score: Score): Observable<{}> {
    return this.http.put(routes.update(score.id), ScoreService.cleanScore(score));
  }
}
