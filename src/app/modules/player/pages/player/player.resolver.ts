import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { first, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { PlayerService } from '@data/services';
import { Player } from '@data/types';

export const playerResolver: ResolveFn<Player | undefined> = (route) => {
  const playerId = route.paramMap.get('id');
  if (playerId !== null) {
    return inject(ApplicationService).team$.pipe(
      switchMap((t) => inject(PlayerService).getPlayer(+playerId, t?.championship.id)),
      first(),
    );
  }

  // eslint-disable-next-line unicorn/no-useless-undefined
  return undefined;
};
