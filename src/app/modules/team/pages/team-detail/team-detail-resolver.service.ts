import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { TeamService } from '@data/services';
import { Team } from '@data/types';

@Injectable()
export class TeamDetailResolver implements Resolve<Team | undefined>  {
  constructor(private readonly ts: TeamService) { }

  public resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<Team> | undefined {
    const teamId = route.paramMap.get('team_id');
    if (teamId !== null) {
      const id = +teamId;

      return this.ts.getTeam(id);
    }

    return undefined;
  }
}
