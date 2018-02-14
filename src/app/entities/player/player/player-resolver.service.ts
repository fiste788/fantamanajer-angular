import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Player } from '../player';
import { PlayerService } from '../player.service';

@Injectable()
export class PlayerResolver implements Resolve<Player> {
    constructor(private cs: PlayerService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Player> {
        const id = parseInt(route.paramMap.get('id'), 10);

        return this.cs.getPlayer(id);
    }
}
