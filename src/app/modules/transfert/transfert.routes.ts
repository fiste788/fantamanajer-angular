import { inject } from '@angular/core';
import type { Route } from '@angular/router';
import { RedirectCommand, Router } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { AppService } from '@app/services';

import { TransfertListPage } from './pages/transfert-list/transfert-list.page';

export default [
  {
    canActivate: [authenticatedGuard],
    component: TransfertListPage,
    data: { state: 'transfert-list' },
    path: '',
  },
  {
    canActivate: [
      authenticatedGuard,
      () => {
        const app = inject(AppService);
        const router = inject(Router);
        const urlTree = router.createUrlTree(['teams', app.requireCurrentTeam().id, 'transferts']);

        return new RedirectCommand(urlTree);
      },
    ],
    children: [],
    path: 'new',
  },
] satisfies Route[];
