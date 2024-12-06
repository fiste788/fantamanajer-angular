import { Route } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet';

export default [
  {
    path: '',
    component: RouterOutletComponent,
    children: [
      {
        path: 'free',
        loadComponent: async () =>
          import('./pages/member-free/member-free.page').then((c) => c.MemberFreePage),
        canActivate: [authenticatedGuard],
        data: {
          state: 'free',
        },
      },
    ],
  },
] satisfies Array<Route>;
