import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, NotLoggedGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';

import { LoginPage } from './pages/login/login.page';
import { LogoutPage } from './pages/logout/logout.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'login-outlet' },
    children: [
      {
        path: 'login',
        component: LoginPage,
        canActivate: [NotLoggedGuard],
        data: { state: 'login' }
      },
      {
        path: 'logout',
        component: LogoutPage,
        canActivate: [AuthGuard],
        data: { state: 'logout' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
  static components = [
    LoginPage,
    LogoutPage
  ];
}
