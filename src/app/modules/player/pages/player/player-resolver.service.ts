import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Player } from '@app/core/models';
import { ApplicationService, PlayerService } from '@app/core/services';
import { Observable } from 'rxjs';

@Injectable()
export class PlayerResolver implements Resolve<Player | undefined> {
  constructor(private readonly cs: PlayerService, private readonly app: ApplicationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Player> | undefined {
    const playerId = route.paramMap.get('id');
    if (playerId !== null) {
      const id = parseInt(playerId, 10);

      return this.cs.getPlayer(id, this.app.championship ? this.app.championship.id : undefined);
    }

    return undefined;

  }
}
