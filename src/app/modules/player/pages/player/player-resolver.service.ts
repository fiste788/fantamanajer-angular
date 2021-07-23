import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { PlayerService } from '@data/services';
import { ApplicationService } from '@app/services';
import { Player } from '@data/types';

@Injectable()
export class PlayerResolver implements Resolve<Player | undefined> {
  constructor(private readonly cs: PlayerService, private readonly app: ApplicationService) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<Player> | undefined {
    const playerId = route.paramMap.get('id');
    if (playerId !== null) {
      const id = +playerId;

      return this.app.teamChange$.pipe(
        switchMap((t) => this.cs.getPlayer(id, t?.championship?.id)),
      );
    }

    return undefined;
  }
}
