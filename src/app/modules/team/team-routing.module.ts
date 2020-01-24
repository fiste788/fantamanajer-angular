import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { TeamDetailComponent } from './pages/team-detail/team-detail.component';
import { TeamMembersComponent } from './components/team-members/team-members.component';
import { TeamDetailResolver } from './pages/team-detail/team-detail-resolver.service';
import { TeamStreamComponent } from './components/team-stream/team-stream.component';
import { ChampionshipAdminGuard } from '@app/core/guards';
import { RouterOutletComponent } from '@app/shared/components/router-outlet/router-outlet.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'team-outlet' },
    children: [
      {
        path: '',
        component: TeamListComponent,
        data: { state: 'team-list' },
      },
      {
        path: ':team_id',
        component: TeamDetailComponent,
        data: {
          breadcrumbs: '{{team.name}}',
          state: 'team-detail',
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
            loadChildren: () => import('@app/modules/article/article.module').then(m => m.ArticleModule),
            data: { state: 'team-articles' },
          },
          {
            path: 'players',
            component: TeamMembersComponent,
            runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
            data: { state: 'team-players' },
          },
          {
            path: 'stream',
            component: TeamStreamComponent,
            data: { state: 'team-stream' },
          },
          {
            path: 'scores',
            loadChildren: () => import('@app/modules/score/score.module').then(m => m.ScoreModule),
            data: { state: 'team-scores' },
          },
          {
            path: 'lineup',
            loadChildren: () => import('@app/modules/lineup/lineup.module').then(m => m.LineupModule),
            data: { state: 'team-lineup' },
          },
          {
            path: 'transferts',
            loadChildren: () => import('@app/modules/transfert/transfert.module').then(m => m.TransfertModule),
            data: { state: 'team-transfert' },
          },
          {
            path: 'admin',
            loadChildren: () => import('@app/modules/admin-team/admin-team.module').then(m => m.AdminTeamModule),
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
