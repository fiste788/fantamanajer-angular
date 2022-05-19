import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, NoAuthGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components';

import { LoginPage } from './pages/login/login.page';
import { LogoutPage } from './pages/logout/logout.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: {
      state: 'login-outlet',
    },
    children: [
      {
        path: 'login',
        component: LoginPage,
        canActivate: [NoAuthGuard],
        data: {
          state: 'login',
        },
      },
      {
        path: 'logout',
        component: LogoutPage,
        canActivate: [AuthGuard],
        data: {
          state: 'logout',
        },
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class AuthRoutingModule {
  public static components = [LoginPage, LogoutPage];
}
