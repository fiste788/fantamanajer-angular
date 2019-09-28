import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core/guards';
import { MemberComponent } from './pages/member/member.component';
import { MemberFreeComponent } from './pages/member-free/member-free.component';

const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    data: { state: 'member' },
    children: [
      { path: 'free', component: MemberFreeComponent, canActivate: [AuthGuard], data: { state: 'free' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
