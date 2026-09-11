import type { Route } from '@angular/router';

import type { Player } from '@data/interfaces';

import { PlayerPage } from './pages/player/player.page';
import { playerResolver } from './pages/player/player.resolver';

export default [
  { component: PlayerPage, path: '' },
  {
    component: PlayerPage,
    data: {
      breadcrumbs: (data: { player: Player }): string => data.player.full_name,
      description: (data: { player: Player }): string => `${data.player.members[0]!.role.singular} - ${data.player.members[0]!.club.name}`,
      ogDescription: (data: { player: Player }): string => `${data.player.members[0]!.role.singular} - ${data.player.members[0]!.club.name}`,

      ogImage: (data: { player: Player }): string => `/svg/clubs.svg#club-${data.player.members[0]!.club.id}`,
      ogTitle: (data: { player: Player }): string => data.player.full_name,
      robots: 'nofollow,index',
      state: 'player-outlet',
    },
    path: ':id',
    resolve: {
      player: playerResolver,
    },
  },
] satisfies Route[];
