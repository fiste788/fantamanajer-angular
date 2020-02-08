import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lineup, Member } from '../models';

@Injectable({ providedIn: 'root' })
export class LineupService {
  private readonly url = 'lineups';

  private static cleanLineup(lineup: Lineup): Lineup {
    const newLineup: Lineup = JSON.parse(JSON.stringify(lineup));
    newLineup.dispositions = newLineup.dispositions.filter(
      value => value.member_id
    );
    newLineup.dispositions.map(disp => delete disp.member);
    delete newLineup.team;
    delete newLineup.modules;
    delete newLineup.module_object;

    return newLineup;
  }

  constructor(private readonly http: HttpClient) { }

  getLineup(teamId: number): Observable<Lineup> {
    return this.http.get<Lineup>(`teams/${teamId}/${this.url}/current`);
  }

  update(lineup: Lineup): Observable<any> {
    return this.http.put(
      `teams/${lineup.team_id}/${this.url}/${lineup.id}`,
      JSON.stringify(LineupService.cleanLineup(lineup))
    );
  }

  create(lineup: Lineup): Observable<Lineup> {
    return this.http.post<Lineup>(
      `teams/${lineup.team_id}/${this.url}`,
      JSON.stringify(LineupService.cleanLineup(lineup))
    );
  }

  getLikelyLineup(lineup: Lineup): Observable<Array<Member>> {
    return this.http.get<Array<Member>>(`teams/${lineup.team_id}/${this.url}/likely`);
  }
}
