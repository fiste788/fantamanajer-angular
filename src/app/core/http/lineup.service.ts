import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RecursivePartial } from '@app/types/recursive-partial.type';
import { Lineup, Member } from '@shared/models';

const url = 'lineups';
const routes = {
  likely: (teamId: number) => `/teams/${teamId}/${url}/likely`,
  lineup: (teamId: number) => `/teams/${teamId}/${url}/current`,
  lineups: (teamId: number) => `/teams/${teamId}/${url}`,
  update: (teamId: number, id: number) => `/teams/${teamId}/${url}/${id}`,
};

@Injectable({ providedIn: 'root' })
export class LineupService {
  private static cleanLineup(lineup: Lineup): RecursivePartial<Lineup> {
    const newLineup: RecursivePartial<Lineup> = JSON.parse(JSON.stringify(lineup));
    const disp = lineup.dispositions.filter((value) => value.member_id !== null);
    disp.forEach((d) => d.member = null);
    newLineup.dispositions = disp;
    delete newLineup.team;
    delete newLineup.modules;

    return newLineup;
  }

  constructor(private readonly http: HttpClient) { }

  public getLineup(teamId: number): Observable<Lineup> {
    return this.http.get<Lineup>(routes.lineup(teamId));
  }

  public update(lineup: Lineup): Observable<Partial<Lineup>> {
    return this.http.put(routes.update(lineup.team_id, lineup.id), LineupService.cleanLineup(lineup));
  }

  public create(lineup: Lineup): Observable<Pick<Lineup, 'id'>> {
    return this.http.post<Lineup>(routes.lineups(lineup.team_id), LineupService.cleanLineup(lineup));
  }

  public getLikelyLineup(lineup: Lineup): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(routes.likely(lineup.team_id));
  }
}
