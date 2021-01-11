import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChampionshipAdminGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';

import { TeamDetailResolver } from './pages/team-detail/team-detail-resolver.service';
import { TeamDetailPage } from './pages/team-detail/team-detail.page';
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
          // eslint-disable-next-line no-template-curly-in-string
          breadcrumbs: '${team.name}',
          state: 'team-detail',
        },
        resolve: {
          team: TeamDetailResolver,
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
            loadChildren: async () => import('@modules/article/article.module')
              .then(m => m.ArticleModule),
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
            loadChildren: async () => import('@modules/score/score.module')
              .then(m => m.ScoreModule),
          },
          {
            path: 'lineup',
            data: { state: 'team-lineup' },
            loadChildren: async () => import('@modules/lineup/lineup.module')
              .then(m => m.LineupModule),
          },
          {
            path: 'transferts',
            data: { state: 'team-transfert' },
            loadChildren: async () => import('@modules/transfert/transfert.module')
              .then(m => m.TransfertModule),
          },
          {
            path: 'admin',
            canActivate: [ChampionshipAdminGuard],
            data: { state: 'team-admin' },
            loadChildren: async () => import('@modules/admin-team/admin-team.module')
              .then(m => m.AdminTeamModule),
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
  public static components = [
    TeamListPage,
    TeamDetailPage,
    TeamMembersPage,
    TeamStreamPage,
  ];
}
