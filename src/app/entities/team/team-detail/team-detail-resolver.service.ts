import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Team } from '../team';
import { TeamService } from '../team.service';

@Injectable()
export class TeamDetailResolver implements Resolve<Team> {
    constructor(private ts: TeamService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Team> {
        const id = parseInt(route.paramMap.get('team_id'), 10);

        return this.ts.getTeam(id);
    }
}
