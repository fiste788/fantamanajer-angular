import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RecursivePartial } from '@app/types/recursive-partial.type';

import { RankingPosition, Score } from '../types';

import { LineupService } from './lineup.service';

const url = 'scores';
const routes = {
  ranking: (id: number) => `/championships/${id}/ranking`,
  score: (id: number) => `/${url}/${id}`,
  team: (id: number) => `/teams/${id}/${url}`,
  update: (id: number) => `/${url}/${id}`,
};

@Injectable({ providedIn: 'root' })
export class ScoreService {
  public static cleanScore(score: Score): RecursivePartial<Score> {
    const clonedScore = JSON.parse(JSON.stringify(score)) as Score;
    const cleanedScore: RecursivePartial<Score> = clonedScore;
    if (clonedScore.lineup) {
      cleanedScore.lineup = LineupService.cleanLineup(clonedScore.lineup);
      delete cleanedScore.lineup.modules;
    }
    delete cleanedScore.team;
    delete cleanedScore.team;

    return cleanedScore;
  }

  constructor(private readonly http: HttpClient) {}

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

  public update(score: Score): Observable<Pick<Score, 'id'>> {
    return this.http.put<Pick<Score, 'id'>>(
      routes.update(score.id),
      ScoreService.cleanScore(score),
    );
  }
}
