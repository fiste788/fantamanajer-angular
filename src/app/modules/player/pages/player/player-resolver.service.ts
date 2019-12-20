import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Player } from '@app/core/models';
import { ApplicationService, PlayerService } from '@app/core/services';

@Injectable()
export class PlayerResolver implements Resolve<Player | undefined> {
  constructor(private cs: PlayerService, private app: ApplicationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Player> | undefined {
    const playerId = route.paramMap.get('id');
    if (playerId) {
      const id = parseInt(playerId, 10);

      return this.cs.getPlayer(id, this.app.championship ? this.app.championship.id : undefined);
    }

    return undefined;

  }
}
