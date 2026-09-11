import type { Route } from '@angular/router';

import { authenticatedGuard, championshipAdminGuard } from '@app/guards';
import type { Team } from '@data/interfaces';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { TeamDetailPage } from './pages/team-detail/team-detail.page';
import { teamResolver } from './pages/team-detail/team.resolver';
import { TeamListPage } from './pages/team-list/team-list.page';
import { teamsResolver } from './pages/team-list/team-list.resolver';
import { TeamMembersPage } from './pages/team-members/team-members.page';
import { TeamStreamPage } from './pages/team-stream/team-stream.page';

export default [
  {
    canActivate: [authenticatedGuard],
    children: [
      {
        component: TeamListPage,
        data: { state: 'team-list' },
        path: '',
        resolve: {
          teams: teamsResolver,
        },
      },
      {
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'players',
          },
          {
            data: { state: 'team-articles' },
            loadChildren: async () => import('@modules/article/article.routes'),
            path: 'articles',
          },
          {
            component: TeamMembersPage,
            data: { state: 'team-players' },
            path: 'players',
            runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
          },
          {
            component: TeamStreamPage,
            data: { state: 'team-stream' },
            path: 'stream',
          },
          {
            data: { state: 'team-scores' },
            loadChildren: async () => import('@modules/score/score.routes'),
            path: 'scores',
          },
          {
            data: { state: 'team-lineup' },
            loadChildren: async () => import('@modules/lineup/lineup.routes'),
            path: 'lineup',
          },
          {
            data: { state: 'team-transfert' },
            loadChildren: async () => import('@modules/transfert/transfert.routes'),
            path: 'transferts',
          },
          {
            canActivate: [championshipAdminGuard],
            data: { state: 'team-admin' },
            loadChildren: async () => import('@modules/admin-team/admin-team.routes'),
            path: 'admin',
          },
        ],
        component: TeamDetailPage,
        data: {
          breadcrumbs: (data: { team: Team }): string => data.team.name,
          state: 'team-detail',
          transitionParam: 'team_id',
        },
        path: ':team_id',
        resolve: {
          team: teamResolver,
        },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
      },
    ],
    component: RouterOutletComponent,
    data: {
      state: 'team-outlet',
      transitionParam: 'team_id',
      viewTransitionOutlet: 'championship-outlet',
    },
    path: '',
  },
] satisfies Route[];
