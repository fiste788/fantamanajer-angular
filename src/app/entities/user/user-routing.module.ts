import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { UserStreamComponent } from './user-stream/user-stream.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumbs: 'Impostazioni'
    },
    children: [
      { path: '', component: ProfileComponent },
      { path: 'stream', component: UserStreamComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
