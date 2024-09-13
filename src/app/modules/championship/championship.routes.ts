import { Route } from '@angular/router';

import { adminGuard } from '@app/guards';
import { Championship } from '@data/types';

import { ChampionshipPage } from './pages/championship/championship.page';
import { championshipResolver } from './pages/championship/championship.resolver';
import { ChampionshipStreamPage } from './pages/championship-stream/championship-stream.page';
import { RollOfHonorPage } from './pages/roll-of-honor/roll-of-honor.page';

export default [
  {
    path: ':championship_id',
    component: ChampionshipPage,
    data: {
      breadcrumbs: (data: { championship: Championship }): string =>
        `${data.championship.league.name}`,
      state: 'championship-outlet',
      viewTransitionOutlet: 'team-outlet',
    },
    resolve: {
      championship: championshipResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'teams',
      },
      {
        path: 'articles',
        data: { state: 'articles' },
        loadChildren: async () => import('@modules/article/article.routes'),
      },
      {
        path: 'teams',
        data: { state: 'teams' },
        loadChildren: async () => import('@modules/team/team.routes'),
      },
      {
        path: 'members',
        data: { state: 'members' },
        loadChildren: async () => import('@modules/member/member.routes'),
      },
      {
        path: 'ranking',
        data: { state: 'ranking' },
        loadChildren: async () => import('@modules/score/score.routes'),
      },
      {
        path: 'roll-of-honor',
        data: { state: 'roll-of-honor' },
        component: RollOfHonorPage,
      },
      {
        path: 'stream',
        component: ChampionshipStreamPage,
        data: { state: 'stream' },
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        data: { state: 'championship-admin' },
        loadChildren: async () => import('@modules/admin-championship/admin-championship.routes'),
      },
    ],
  },
] as Array<Route>;
