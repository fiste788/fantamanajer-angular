import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamComponent } from './team/team.component';
import { EditMembersComponent } from './edit-members/edit-members.component';
import { NewTransfertComponent } from './new-transfert/new-transfert.component';
import { HomeComponent } from './home/home.component';
import { ScoreEditComponent } from './score-edit/score-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TeamComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: HomeComponent },
      { path: 'members', component: EditMembersComponent },
      { path: 'new_transfert', component: NewTransfertComponent },
      { path: 'score/edit', component: ScoreEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
