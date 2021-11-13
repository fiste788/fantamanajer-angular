import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { first, Observable, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { PlayerService } from '@data/services';
import { Player } from '@data/types';

@Injectable()
export class PlayerResolver implements Resolve<Player | undefined> {
  constructor(private readonly cs: PlayerService, private readonly app: ApplicationService) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<Player> | undefined {
    const playerId = route.paramMap.get('id');
    if (playerId !== null) {
      const id = +playerId;

      return this.app.team$.pipe(
        switchMap((t) => this.cs.getPlayer(id, t?.championship?.id)),
        first(),
      );
    }

    return undefined;
  }
}
