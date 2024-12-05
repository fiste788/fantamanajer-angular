import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { PlayerService } from '@data/services';
import { Player } from '@data/types';

export const playerResolver: ResolveFn<Player | undefined> = async (route) => {
  const playerId = route.paramMap.get('id');
  const app = inject(ApplicationService);
  const ps = inject(PlayerService);
  if (playerId !== null) {
    return firstValueFrom(
      app.team$.pipe(switchMap((t) => ps.getPlayer(+playerId, t?.championship.id))),
      { defaultValue: undefined },
    );
  }

  return undefined;
};
