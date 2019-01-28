import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Team } from '@app/core/models';
import { TeamService } from '@app/core/services';

@Injectable()
export class TeamDetailResolver implements Resolve<Team> {
    constructor(private ts: TeamService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Team> {
        const id = parseInt(route.paramMap.get('team_id'), 10);

        return this.ts.getTeam(id);
    }
}
