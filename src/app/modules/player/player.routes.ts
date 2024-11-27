import { Route } from '@angular/router';

import { Player } from '@data/types';

import { PlayerPage } from './pages/player/player.page';
import { playerResolver } from './pages/player/player.resolver';

export default [
  { path: '', component: PlayerPage },
  {
    path: ':id',
    component: PlayerPage,
    data: {
      breadcrumbs: (data: { player: Player }): string => `${data.player.full_name}`,
      state: 'player-detail',
      description: (data: { player: Player }): string =>
        `${data.player.members[0]!.role.singolar} - ${data.player.members[0]!.club.name}`,
      ogDescription: (data: { player: Player }): string =>
        `${data.player.members[0]!.role.singolar} - ${data.player.members[0]!.club.name}`,
      ogImage: (data: { player: Player }): string =>
        `/svg/clubs.svg#club-${data.player.members[0]!.club.id}`,
      ogTitle: (data: { player: Player }): string => `${data.player.full_name}`,
    },
    resolve: {
      player: playerResolver,
    },
  },
] satisfies Array<Route>;
