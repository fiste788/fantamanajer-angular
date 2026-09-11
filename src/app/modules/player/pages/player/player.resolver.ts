import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';

import { AppService } from '@app/services';
import type { Player } from '@data/interfaces';
import { PlayerService } from '@data/services';

export const playerResolver: ResolveFn<Player | undefined> = (route) => {
  const playerId = route.paramMap.get('id');
  const app = inject(AppService);
  const ps = inject(PlayerService);

  return playerId === null ? undefined : ps.getPlayer(+playerId, app.currentTeam()?.championship.id);
};
