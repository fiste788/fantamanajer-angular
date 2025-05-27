import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { ApplicationService } from '@app/services';
import { PlayerService } from '@data/services';
import { Player } from '@data/types';

export const playerResolver: ResolveFn<Player | undefined> = (route) => {
  const playerId = route.paramMap.get('id');
  const app = inject(ApplicationService);
  const ps = inject(PlayerService);
  if (playerId !== null) {
    return ps.getPlayer(+playerId, app.team()?.championship.id);
  }

  return undefined;
};
