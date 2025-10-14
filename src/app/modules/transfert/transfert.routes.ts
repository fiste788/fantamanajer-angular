import { inject } from '@angular/core';
import { RedirectCommand, Route, Router } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { ApplicationService } from '@app/services';

import { TransfertListPage } from './pages/transfert-list/transfert-list.page';

export default [
  {
    path: '',
    component: TransfertListPage,
    canActivate: [authenticatedGuard],
    data: { state: 'transfert-list' },
  },
  {
    path: 'new',
    children: [],
    canActivate: [
      authenticatedGuard,
      () => {
        const app = inject(ApplicationService);
        const router = inject(Router);
        const urlTree = router.createUrlTree(['teams', app.requireCurrentTeam().id, 'transferts']);

        return new RedirectCommand(urlTree);
      },
    ],
  },
] satisfies Array<Route>;
