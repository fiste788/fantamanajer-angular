import { inject } from '@angular/core';
import { RedirectCommand, Route, Router } from '@angular/router';
import { map } from 'rxjs';

import { authenticatedGuard } from '@app/guards';
import { ApplicationService } from '@app/services';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { LineupLastPage } from './pages/lineup-last/lineup-last.page';

export default [
  {
    path: '',
    canActivate: [authenticatedGuard],
    component: RouterOutletComponent,
    children: [
      {
        path: 'current',
        component: LineupLastPage,
        data: {
          state: 'lineup-detail',
        },
      },
      {
        path: 'new',
        children: [],
        canActivate: [
          () => {
            const app = inject(ApplicationService);
            const router = inject(Router);

            return app.requireTeam$.pipe(
              map((t) => router.createUrlTree(['teams', t.id, 'lineup', 'current'])),
              map((urlTree) => new RedirectCommand(urlTree)),
            );
          },
        ],
      },
    ],
  },
] satisfies Array<Route>;
