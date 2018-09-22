import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamAdminComponent } from './team-admin/team-admin.component';
import { EditMembersComponent } from './edit-members/edit-members.component';
import { NewTransfertComponent } from './new-transfert/new-transfert.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: TeamAdminComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: HomeComponent },
      { path: 'members', component: EditMembersComponent },
      { path: 'new_transfert', component: NewTransfertComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamAdminRoutingModule { }
