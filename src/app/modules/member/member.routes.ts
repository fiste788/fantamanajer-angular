import { Routes } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components';

import { MemberFreePage } from './pages/member-free/member-free.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'member-outlet' },
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
];

export default routes;
