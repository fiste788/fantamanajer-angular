import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  // { path: 'members/free', component: MemberFreeComponent, canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: '',
    children: [
      { path: '', component: ProfileComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
