import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from '../shared/auth/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [{
      path: 'teams',
      component: TeamEditComponent,
      canActivate: [AdminGuard]
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
