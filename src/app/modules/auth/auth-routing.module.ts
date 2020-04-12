import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, NotLoggedGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';

import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'login-outlet' },
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [NotLoggedGuard],
        data: { state: 'login' }
      },
      {
        path: 'logout',
        component: LogoutComponent,
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
    LoginComponent,
    LogoutComponent
  ];
}
