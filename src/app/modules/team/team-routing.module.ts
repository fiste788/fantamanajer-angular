import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionshipAdminGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';
import { TeamMembersComponent } from './components/team-members/team-members.component';
import { TeamStreamComponent } from './components/team-stream/team-stream.component';
import { TeamDetailResolver } from './pages/team-detail/team-detail-resolver.service';
import { TeamDetailComponent } from './pages/team-detail/team-detail.component';
import { TeamListComponent } from './pages/team-list/team-list.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'team-outlet' },
    children: [
      {
        path: '',
        component: TeamListComponent,
        data: { state: 'team-list' }
      },
      {
        path: ':team_id',
        component: TeamDetailComponent,
        data: {
          breadcrumbs: '{{team.name}}',
          state: 'team-detail'
        },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
        resolve: {
          team: TeamDetailResolver
        },
        children: [
          {
            path: '',
            redirectTo: 'players',
            pathMatch: 'full'
          },
          {
            path: 'articles',
            loadChildren: () => import('@modules/article/article.module')
              .then(m => m.ArticleModule),
            data: { state: 'team-articles' }
          },
          {
            path: 'players',
            component: TeamMembersComponent,
            runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
            data: { state: 'team-players' }
          },
          {
            path: 'stream',
            component: TeamStreamComponent,
            data: { state: 'team-stream' }
          },
          {
            path: 'scores',
            loadChildren: () => import('@modules/score/score.module')
              .then(m => m.ScoreModule),
            data: { state: 'team-scores' }
          },
          {
            path: 'lineup',
            loadChildren: () => import('@modules/lineup/lineup.module')
              .then(m => m.LineupModule),
            data: { state: 'team-lineup' }
          },
          {
            path: 'transferts',
            loadChildren: () => import('@modules/transfert/transfert.module')
              .then(m => m.TransfertModule),
            data: { state: 'team-transfert' }
          },
          {
            path: 'admin',
            loadChildren: () => import('@modules/admin-team/admin-team.module')
              .then(m => m.AdminTeamModule),
            canActivate: [ChampionshipAdminGuard],
            data: { state: 'team-admin' }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
