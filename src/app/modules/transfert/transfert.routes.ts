import { inject } from '@angular/core';
import { RedirectCommand, Route, Router } from '@angular/router';
import { map } from 'rxjs';

import { ApplicationService } from '@app/services';

import { TransfertListPage } from './pages/transfert-list/transfert-list.page';

export default [
  {
    path: '',
    component: TransfertListPage,
    data: { state: 'transfert-list' },
  },
  {
    path: 'new',
    children: [],
    canActivate: [
      () => {
        const app = inject(ApplicationService);
        const router = inject(Router);

        return app.requireTeam$.pipe(
          map((t) => router.createUrlTree(['teams', t.id, 'transferts'])),
          map((urlTree) => new RedirectCommand(urlTree, { skipLocationChange: true })),
        );
      },
    ],
  },
] as Array<Route>;
