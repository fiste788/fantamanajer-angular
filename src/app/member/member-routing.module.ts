import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { MemberComponent } from './member.component';
import { MemberFreeComponent } from './member-free/member-free.component';

const routes: Routes = [
  // { path: 'members/free', component: MemberFreeComponent, canActivate: [AuthGuard] },
  {
    path: 'members',
    component: MemberComponent,
    children: [
      { path: 'free', component: MemberFreeComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
