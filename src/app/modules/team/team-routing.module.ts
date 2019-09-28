import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamComponent } from './pages/team/team.component';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { TeamDetailComponent } from './pages/team-detail/team-detail.component';
import { TeamMembersComponent } from './components/team-members/team-members.component';
import { TeamDetailResolver } from './pages/team-detail/team-detail-resolver.service';
import { TeamStreamComponent } from './components/team-stream/team-stream.component';
import { ChampionshipAdminGuard } from '@app/core/guards';

const routes: Routes = [
  {
    path: '',
    component: TeamComponent,
    data: { state: 'team' },
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
        runGuardsAndResolvers: 'paramsChange',
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
            loadChildren: () => import('app/modules/article/article.module').then(m => m.ArticleModule),
            data: { state: 'articles' },
          },
          {
            path: 'players',
            component: TeamMembersComponent,
            data: { state: 'players' },
          },
          {
            path: 'stream',
            component: TeamStreamComponent,
            data: { state: 'stream' },
          },
          {
            path: 'scores',
            loadChildren: () => import('app/modules/score/score.module').then(m => m.ScoreModule),
            data: { state: 'scores' },
          },
          {
            path: 'lineup',
            loadChildren: () => import('app/modules/lineup/lineup.module').then(m => m.LineupModule),
            data: { state: 'lineup' },
          },
          {
            path: 'transferts',
            loadChildren: () => import('app/modules/transfert/transfert.module').then(m => m.TransfertModule),
            data: { state: 'transfert' },
          },
          {
            path: 'admin',
            loadChildren: () => import('app/modules/admin-team/admin-team.module').then(m => m.AdminTeamModule),
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
