import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Team } from '@app/core/models';
import { TeamService } from '@app/core/services';
import { Observable } from 'rxjs';

@Injectable()
export class TeamDetailResolver implements Resolve<Team | undefined>  {
  constructor(private readonly ts: TeamService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Team> | undefined {
    const teamId = route.paramMap.get('team_id');
    if (teamId !== null) {
      const id = parseInt(teamId, 10);

      return this.ts.getTeam(id);
    }

    return undefined;
  }
}
