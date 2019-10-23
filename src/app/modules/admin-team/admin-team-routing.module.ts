import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditMembersComponent } from './pages/edit-members/edit-members.component';
import { NewTransfertComponent } from './pages/new-transfert/new-transfert.component';
import { HomeComponent } from './pages/home/home.component';
import { ScoreEditComponent } from './pages/score-edit/score-edit.component';
import { RouterOutletComponent } from '@app/shared/components/router-outlet/router-outlet.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: HomeComponent, data: { state: 'admin-team-index' } },
      { path: 'members', component: EditMembersComponent, data: { state: 'admin-team-members' } },
      { path: 'new_transfert', component: NewTransfertComponent, data: { state: 'admin-new-transferts' } },
      { path: 'score/edit', component: ScoreEditComponent, data: { state: 'admin-score-edit' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTeamRoutingModule { }
