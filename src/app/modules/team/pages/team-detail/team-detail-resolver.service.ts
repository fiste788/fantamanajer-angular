import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Team } from '@app/core/models';
import { TeamService } from '@app/core/services';

@Injectable()
export class TeamDetailResolver implements Resolve<Team | undefined>  {
  constructor(private ts: TeamService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Team> | undefined {
    const teamId = route.paramMap.get('team_id');
    if (teamId) {
      const id = parseInt(teamId, 10);
      return this.ts.getTeam(id);
    }

    return undefined;
  }
}
