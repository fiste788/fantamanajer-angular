import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';

import { AuthenticationService } from '@app/authentication';
import { noAuthGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { LoginPage } from './pages/login/login.page';

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
        canActivate: [
          async () => {
            const authService = inject(AuthenticationService);
            const router = inject(Router);

            await authService.logout();

            return router.navigate(['/']);
          },
        ],
        data: {
          state: 'logout',
        },
      },
    ],
  },
] as Array<Route>;
