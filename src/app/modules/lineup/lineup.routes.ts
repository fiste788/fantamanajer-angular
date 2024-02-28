import { Route } from '@angular/router';

import { RouterOutletComponent } from '@shared/components';

import { AddLineupShortcutPage } from './pages/add-lineup-shortcut/add-lineup-shortcut.page';
import { LineupLastPage } from './pages/lineup-last/lineup-last.page';

export default [
  {
    path: '',
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
        component: AddLineupShortcutPage,
      },
    ],
  },
] as Array<Route>;
