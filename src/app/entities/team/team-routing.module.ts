import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamComponent } from './team/team.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { TeamDetailResolver } from './team-detail/team-detail-resolver.service';
import { TeamStreamComponent } from './team-stream/team-stream.component';
import { AdminGuard } from '../../shared/auth/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: TeamComponent,
    children: [
      {
        path: '',
        component: TeamListComponent
      },
      {
        path: ':team_id',
        component: TeamDetailComponent,
        data: {
          breadcrumbs: '{{team.name}}'
        },
        resolve: {
          team: TeamDetailResolver
        },
        children: [
          { path: '', redirectTo: 'players', pathMatch: 'full' },
          { path: 'articles', loadChildren: 'app/entities/article/article.module#ArticleModule' },
          { path: 'players', component: TeamMembersComponent },
          { path: 'stream', component: TeamStreamComponent },
          { path: 'scores', loadChildren: 'app/entities/score/score.module#ScoreModule' },
          { path: 'lineup', loadChildren: 'app/entities/lineup/lineup.module#LineupModule' },
          { path: 'transferts', loadChildren: 'app/entities/transfert/transfert.module#TransfertModule' },
          { path: 'admin', loadChildren: 'app/admin/team-admin/team-admin.module#TeamAdminModule', canActivate: [AdminGuard] }
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
