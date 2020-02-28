import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';
import { MemberFreeComponent } from './pages/member-free/member-free.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'member-outlet' },
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
