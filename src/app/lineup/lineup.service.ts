import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Lineup } from './lineup';
import { Member } from '../member/member';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class LineupService {
    private url = 'lineups';

    constructor(private route: ActivatedRoute,
          private http: HttpClient,
          private shared: SharedService) {}


    getLineup(team_id): Promise<{members: Member[], lineup: Lineup, modules: string[]}> {
      const url = `teams/${team_id}/${this.url}/current`;
      return this.http.get<{members: Member[], lineup: Lineup, modules: string[]}>(url)
            .toPromise()
    }

  update(lineup: Lineup): Promise<any> {
      const url = `teams/${lineup.team_id}/${this.url}/` + lineup.id;
      return this.http
          .put(url, JSON.stringify(lineup))
          .toPromise()
  }

  create(lineup: Lineup): Promise<Lineup> {
      return this.http
          .post<Lineup>(`teams/${lineup.team_id}/${this.url}`, JSON.stringify(lineup))
          .toPromise()
          .catch(this.shared.handleError);
  }

}
