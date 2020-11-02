import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RecursivePartial } from '@app/types/recursive-partial.type';
import { Score, Team } from '@shared/models';

import { LineupService } from './lineup.service';

const url = 'scores';
const routes = {
  ranking: (id: number) => `/championships/${id}/ranking`,
  score: (id: number) => `/${url}/${id}`,
  team: (id: number) => `/teams/${id}/${url}`,
  update: (id: number) => `/${url}/${id}`,
};

export interface RankingPosition {
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
    const clonedScore: Score = JSON.parse(JSON.stringify(score));
    const cleanedScore: RecursivePartial<Score> = clonedScore;
    if (clonedScore.lineup) {
      cleanedScore.lineup = LineupService.cleanLineup(clonedScore.lineup);
      delete cleanedScore.lineup.modules;
    }
    delete cleanedScore.team;
    delete cleanedScore.team;

    return cleanedScore;
  }

  constructor(private readonly http: HttpClient) { }

  public getRanking(championshipId: number): Observable<Array<RankingPosition>> {
    return this.http.get<Array<RankingPosition>>(routes.ranking(championshipId));
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
