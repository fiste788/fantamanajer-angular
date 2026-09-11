import { inject } from '@angular/core';
import type { Route } from '@angular/router';
import { RedirectCommand, Router } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { AppService } from '@app/services';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { LineupService } from './components/lineup.service';
import { LineupLastPage } from './pages/lineup-last/lineup-last.page';

export default [
  {
    canActivate: [authenticatedGuard],
    children: [
      {
        component: LineupLastPage,
        data: {
          state: 'lineup-detail',
        },
        path: 'current',
      },
      {
        canActivate: [
          () => {
            const app = inject(AppService);
            const router = inject(Router);

            const urlTree = router.createUrlTree(['teams', app.requireCurrentTeam().id, 'lineup', 'current']);

            return new RedirectCommand(urlTree);
          },
        ],
        children: [],
        path: 'new',
      },
    ],
    component: RouterOutletComponent,
    path: '',
    providers: [LineupService],
  },
] satisfies Route[];
