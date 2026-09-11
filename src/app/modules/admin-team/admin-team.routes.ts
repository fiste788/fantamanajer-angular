import type { Route } from '@angular/router';

import { RouterOutletComponent } from '@shared/components/router-outlet';

import { EditMembersPage } from './pages/edit-members/edit-members.page';
import { HomePage } from './pages/home/home.page';
import { NewTransfertPage } from './pages/new-transfert/new-transfert.page';
import { ScoreEditPage } from './pages/score-edit/score-edit.page';

export default [
  {
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'index',
      },
      {
        component: HomePage,
        data: {
          state: 'admin-team-index',
        },
        path: 'index',
      },
      {
        component: EditMembersPage,
        data: {
          state: 'admin-team-members',
        },
        path: 'members',
      },
      {
        component: NewTransfertPage,
        data: {
          state: 'admin-new-transferts',
        },
        path: 'new_transfert',
      },
      {
        component: ScoreEditPage,
        data: {
          state: 'admin-score-edit',
        },
        path: 'score/edit',
      },
    ],
    component: RouterOutletComponent,
    path: '',
  },
] satisfies Route[];
