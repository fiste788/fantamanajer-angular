import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PlayerService } from '@app/http';
import { ApplicationService } from '@app/services';
import { Player } from '@shared/models';
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
