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
          { path: '', redirectTo: 'players', pathMatch: 'full' },
          { path: 'articles', loadChildren: 'app/modules/article/article.module#ArticleModule', data: { state: 'articles' }, },
          { path: 'players', component: TeamMembersComponent, data: { state: 'players' }, },
          { path: 'stream', component: TeamStreamComponent, data: { state: 'stream' }, },
          { path: 'scores', loadChildren: 'app/modules/score/score.module#ScoreModule', data: { state: 'scores' }, },
          { path: 'lineup', loadChildren: 'app/modules/lineup/lineup.module#LineupModule', data: { state: 'lineup' }, },
          { path: 'transferts', loadChildren: 'app/modules/transfert/transfert.module#TransfertModule', data: { state: 'transfert' }, },
          {
            path: 'admin',
            loadChildren: 'app/admin/team/team.module#TeamModule',
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
