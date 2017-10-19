import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamComponent } from './team/team.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamMembersComponent } from './team-members/team-members.component';

const routes: Routes = [
  { path: '',
    component: TeamComponent,
    children: [
      { path: '', component: TeamListComponent },
      { path: ':team_id', component: TeamDetailComponent, children: [
        { path: '', redirectTo: 'players', pathMatch: 'full'},
        { path: 'articles', loadChildren: 'app/article/article.module#ArticleModule'},
        { path: 'players', component: TeamMembersComponent},
        { path: 'scores', loadChildren: 'app/score/score.module#ScoreModule'},
        { path: 'lineup', loadChildren: 'app/lineup/lineup.module#LineupModule'},
        { path: 'transferts', loadChildren: 'app/transfert/transfert.module#TransfertModule'}
        ]}
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule {}
