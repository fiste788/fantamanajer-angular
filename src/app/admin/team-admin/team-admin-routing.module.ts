import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamAdminComponent } from './team-admin/team-admin.component';
import { EditMembersComponent } from './edit-members/edit-members.component';
import { AdminGuard } from '../../shared/auth/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: TeamAdminComponent,
    children: [
      { path: '', redirectTo: 'members', pathMatch: 'full' },
      { path: 'members', component: EditMembersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamAdminRoutingModule { }
