/* eslint-disable @typescript-eslint/promise-function-async */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { championshipAdminGuard } from '@app/guards';
import { Team } from '@data/types';
import { RouterOutletComponent } from '@shared/components';

import { TeamDetailPage } from './pages/team-detail/team-detail.page';
import { teamResolver } from './pages/team-detail/team.resolver';
import { TeamListPage } from './pages/team-list/team-list.page';
import { TeamMembersPage } from './pages/team-members/team-members.page';
import { TeamStreamPage } from './pages/team-stream/team-stream.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'team-outlet' },
    children: [
      {
        path: '',
        component: TeamListPage,
        data: { state: 'team-list' },
      },
      {
        path: ':team_id',
        component: TeamDetailPage,
        data: {
          breadcrumbs: (data: { team: Team }): string => `${data.team.name}`,
          stabreadte: 'team-detail',
        },
        resolve: {
          team: teamResolver,
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'players',
          },
          {
            path: 'articles',
            data: { state: 'team-articles' },
            loadChildren: () => import('@modules/article/article.module'),
          },
          {
            path: 'players',
            component: TeamMembersPage,
            data: { state: 'team-players' },
            runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
          },
          {
            path: 'stream',
            component: TeamStreamPage,
            data: { state: 'team-stream' },
          },
          {
            path: 'scores',
            data: { state: 'team-scores' },
            loadChildren: () => import('@modules/score/score.module'),
          },
          {
            path: 'lineup',
            data: { state: 'team-lineup' },
            loadChildren: () => import('@modules/lineup/lineup.module'),
          },
          {
            path: 'transferts',
            data: { state: 'team-transfert' },
            loadChildren: () => import('@modules/transfert/transfert.module'),
          },
          {
            path: 'admin',
            canActivate: [championshipAdminGuard],
            data: { state: 'team-admin' },
            loadChildren: () => import('@modules/admin-team/admin-team.module'),
          },
        ],
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class TeamRoutingModule {
  public static components = [TeamListPage, TeamDetailPage, TeamMembersPage, TeamStreamPage];
}
