import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components';

import { MemberFreePage } from './pages/member-free/member-free.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'member-outlet' },
    children: [
      {
        path: 'free',
        component: MemberFreePage,
        canActivate: [AuthGuard],
        data: {
          state: 'free',
        },
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class MemberRoutingModule {
  public static components = [MemberFreePage];
}
