import { Routes } from '@angular/router';

import { RouterOutletComponent } from '@shared/components';

import { AddLineupShortcutPage } from './pages/add-lineup-shortcut/add-lineup-shortcut.page';
import { LineupLastPage } from './pages/lineup-last/lineup-last.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'lineup-outlet' },
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
        component: AddLineupShortcutPage,
      },
    ],
  },
];

export default routes;
