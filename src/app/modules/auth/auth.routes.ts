import { Routes } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
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
        canActivate: [authenticatedGuard],
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
];

export default routes;
