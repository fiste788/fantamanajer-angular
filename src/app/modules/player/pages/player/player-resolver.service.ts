import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PlayerService } from '@data/services';
import { ApplicationService } from '@app/services';
import { Player } from '@data/types';

@Injectable()
export class PlayerResolver implements Resolve<Player | undefined> {
  constructor(private readonly cs: PlayerService, private readonly app: ApplicationService) { }

  public resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<Player> | undefined {
    const playerId = route.paramMap.get('id');
    if (playerId !== null) {
      const id = +playerId;

      return this.cs.getPlayer(id, this.app.championship ? this.app.championship.id : undefined);
    }

    return undefined;

  }
}
