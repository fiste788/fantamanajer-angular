import { Routes } from '@angular/router';

import { Player } from '@data/types';

import { PlayerPage } from './pages/player/player.page';
import { playerResolver } from './pages/player/player.resolver';

const routes: Routes = [
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
];

export default routes;
