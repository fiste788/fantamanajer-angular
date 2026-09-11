import type { Route } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet';

export default [
  {
    children: [
      {
        canActivate: [authenticatedGuard],
        data: {
          state: 'free',
        },
        loadComponent: async () => import('./pages/member-free/member-free.page').then(c => c.MemberFreePage),
        path: 'free',
      },
    ],
    component: RouterOutletComponent,
    path: '',
  },
] satisfies Route[];
