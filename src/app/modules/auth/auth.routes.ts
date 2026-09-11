import { inject } from '@angular/core';
import type { Route } from '@angular/router';
import { RedirectCommand, Router } from '@angular/router';

import { AuthenticationService } from '@app/authentication';
import { noAuthGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { LoginPage } from './pages/login/login.page';

export default [
  {
    children: [
      {
        canActivate: [noAuthGuard],
        component: LoginPage,
        data: {
          state: 'login',
        },
        path: 'login',
      },
      {
        canActivate: [
          async () => {
            const authService = inject(AuthenticationService);
            const router = inject(Router);

            await authService.logout();

            return new RedirectCommand(router.createUrlTree(['/']), { skipLocationChange: false });
          },
        ],
        children: [],
        path: 'logout',
      },
    ],
    component: RouterOutletComponent,
    path: '',
  },
] satisfies Route[];
