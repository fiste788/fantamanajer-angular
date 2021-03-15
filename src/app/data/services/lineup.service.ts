import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RecursivePartial } from '@app/types/recursive-partial.type';

import { Disposition, Lineup, Member } from '../types';

const url = 'lineups';
const routes = {
  likely: (teamId: number) => `/teams/${teamId}/${url}/likely`,
  lineup: (teamId: number) => `/teams/${teamId}/${url}/current`,
  lineups: (teamId: number) => `/teams/${teamId}/${url}`,
  update: (teamId: number, id: number) => `/teams/${teamId}/${url}/${id}`,
};

@Injectable({ providedIn: 'root' })
export class LineupService {
  public static cleanLineup(lineup: Lineup): RecursivePartial<Lineup> {
    const clonedLineup = JSON.parse(JSON.stringify(lineup)) as Lineup;
    const dispositions: RecursivePartial<Disposition>[] = clonedLineup.dispositions;
    const disp = dispositions.filter((value) => value?.member_id !== null);
    // eslint-disable-next-line no-null/no-null
    disp.forEach((d) => (d.member = null));
    const cleanedLineup: RecursivePartial<Lineup> = clonedLineup;
    cleanedLineup.dispositions = disp;
    delete cleanedLineup.team;
    delete cleanedLineup.modules;

    return cleanedLineup;
  }

  constructor(private readonly http: HttpClient) {}

  public getLineup(teamId: number): Observable<Lineup> {
    return this.http.get<Lineup>(routes.lineup(teamId));
  }

  public update(lineup: Lineup): Observable<Partial<Lineup>> {
    return this.http.put(
      routes.update(lineup.team_id, lineup.id),
      LineupService.cleanLineup(lineup),
    );
  }

  public create(lineup: Lineup): Observable<Pick<Lineup, 'id'>> {
    return this.http.post<Lineup>(
      routes.lineups(lineup.team_id),
      LineupService.cleanLineup(lineup),
    );
  }

  public getLikelyLineup(lineup: Lineup): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(routes.likely(lineup.team_id));
  }
}
