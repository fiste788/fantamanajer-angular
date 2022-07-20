import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AtLeast } from '@app/types';
import { RecursivePartial } from '@app/types/recursive-partial.type';
import { EmptyLineup } from '@data/types/empty-lineup.model';

import { Lineup, Member } from '../types';

const url = 'lineups';
const routes = {
  likely: (teamId: number) => `/teams/${teamId}/${url}/likely`,
  lineup: (teamId: number) => `/teams/${teamId}/${url}/current`,
  lineups: (teamId: number) => `/teams/${teamId}/${url}`,
  update: (teamId: number, id: number) => `/teams/${teamId}/${url}/${id}`,
};

@Injectable({ providedIn: 'root' })
export class LineupService {
  public static cleanLineup(lineup: AtLeast<Lineup, 'team'>): RecursivePartial<Lineup> {
    const clonedLineup = { ...(lineup as Lineup) };
    const { dispositions } = clonedLineup;
    const disp = dispositions.filter((value) => value.member_id !== null);
    // eslint-disable-next-line no-null/no-null
    disp.forEach((d) => (d.member = null));
    const cleanedLineup: RecursivePartial<Lineup> = clonedLineup;
    cleanedLineup.dispositions = disp;
    delete cleanedLineup.team;
    delete cleanedLineup.modules;

    return cleanedLineup;
  }

  constructor(private readonly http: HttpClient) {}

  public getLineup(teamId: number): Observable<EmptyLineup> {
    return this.http.get<EmptyLineup>(routes.lineup(teamId), { params: { v: '2' } });
  }

  public update(lineup: AtLeast<Lineup, 'id' | 'team'>): Observable<Pick<Lineup, 'id'>> {
    return this.http.put<Pick<Lineup, 'id'>>(
      routes.update(lineup.team.id, lineup.id),
      LineupService.cleanLineup(lineup),
    );
  }

  public create(lineup: AtLeast<Lineup, 'team'>): Observable<AtLeast<Lineup, 'id'>> {
    return this.http.post<Lineup>(
      routes.lineups(lineup.team.id),
      LineupService.cleanLineup(lineup),
    );
  }

  public getLikelyLineup(lineup: EmptyLineup): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(routes.likely(lineup.team.id));
  }
}
