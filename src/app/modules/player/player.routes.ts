import { Route } from '@angular/router';

import { Player } from '@data/types';

import { PlayerPage } from './pages/player/player.page';
import { playerResolver } from './pages/player/player.resolver';

export default [
  { path: '', component: PlayerPage, data: { state: 'player' } },
  {
    path: ':id',
    component: PlayerPage,
    data: {
      breadcrumbs: (data: { player: Player }): string => `${data.player.full_name}`,
      state: 'player-detail',
    },
    resolve: {
      player: playerResolver,
    },
  },
] as Array<Route>;
