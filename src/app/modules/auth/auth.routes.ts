import { Route } from '@angular/router';

import { authenticatedGuard, noAuthGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { LoginPage } from './pages/login/login.page';
import { LogoutPage } from './pages/logout/logout.page';

export default [
  {
    path: '',
    component: RouterOutletComponent,
    children: [
      {
        path: 'login',
        component: LoginPage,
        canActivate: [noAuthGuard],
        data: {
          state: 'login',
        },
      },
      {
        path: 'logout',
        component: LogoutPage,
        canActivate: [authenticatedGuard],
        data: {
          state: 'logout',
        },
      },
    ],
  },
] as Array<Route>;
