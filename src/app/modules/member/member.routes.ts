import { Route } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { MemberFreePage } from './pages/member-free/member-free.page';

export default [
  {
    path: '',
    component: RouterOutletComponent,
    children: [
      {
        path: 'free',
        component: MemberFreePage,
        canActivate: [authenticatedGuard],
        data: {
          state: 'free',
        },
      },
    ],
  },
] satisfies Array<Route>;
