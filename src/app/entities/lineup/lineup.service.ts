import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Lineup } from './lineup';
import { Member } from '../member/member';
import { SharedService } from 'app/shared/shared.service';

@Injectable()
export class LineupService {
  private url = 'lineups';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private shared: SharedService
  ) { }

  getLineup(
    team_id
  ): Observable<Lineup> {
    return this.http.get<Lineup>(`teams/${team_id}/${this.url}/current`);
  }

  update(lineup: Lineup): Observable<any> {
    return this.http.put(
      `teams/${lineup.team_id}/${this.url}/` + lineup.id,
      JSON.stringify(lineup)
    );
  }

  create(lineup: Lineup): Observable<Lineup> {
    return this.http.post<Lineup>(
      `teams/${lineup.team_id}/${this.url}`,
      JSON.stringify(lineup)
    );
  }
}
