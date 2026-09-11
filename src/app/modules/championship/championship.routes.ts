import type { Route } from '@angular/router';

import { adminGuard, authenticatedGuard } from '@app/guards';
import type { Championship } from '@data/interfaces';

import { ChampionshipStreamPage } from './pages/championship-stream/championship-stream.page';
import { ChampionshipPage } from './pages/championship/championship.page';
import { championshipResolver } from './pages/championship/championship.resolver';
import { RollOfHonorPage } from './pages/roll-of-honor/roll-of-honor.page';

export default [
  {
    canActivate: [authenticatedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'teams',
      },
      {
        data: { state: 'articles' },
        loadChildren: async () => import('@modules/article/article.routes'),
        path: 'articles',
      },
      {
        data: { state: 'teams' },
        loadChildren: async () => import('@modules/team/team.routes'),
        path: 'teams',
      },
      {
        data: { state: 'members' },
        loadChildren: async () => import('@modules/member/member.routes'),
        path: 'members',
      },
      {
        data: { state: 'ranking' },
        loadChildren: async () => import('@modules/score/score.routes'),
        path: 'ranking',
      },
      {
        component: RollOfHonorPage,
        data: { state: 'roll-of-honor' },
        path: 'roll-of-honor',
      },
      {
        component: ChampionshipStreamPage,
        data: { state: 'stream' },
        path: 'stream',
      },
      {
        canActivate: [adminGuard],
        data: { state: 'championship-admin' },
        loadChildren: async () => import('@modules/admin-championship/admin-championship.routes'),
        path: 'admin',
      },
    ],
    component: ChampionshipPage,
    data: {
      breadcrumbs: (data: { championship: Championship }): string => data.championship.league.name,
      state: 'championship-outlet',
      viewTransitionOutlet: 'team-outlet',
    },
    path: ':championship_id',
    resolve: {
      championship: championshipResolver,
    },
  },
] satisfies Route[];
