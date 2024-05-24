import { Route } from '@angular/router';

import { RouterOutletComponent } from '@shared/components/router-outlet';

import { EditMembersPage } from './pages/edit-members/edit-members.page';
import { HomePage } from './pages/home/home.page';
import { NewTransfertPage } from './pages/new-transfert/new-transfert.page';
import { ScoreEditPage } from './pages/score-edit/score-edit.page';

export default [
  {
    path: '',
    component: RouterOutletComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'index',
      },
      {
        path: 'index',
        component: HomePage,
        data: {
          state: 'admin-team-index',
        },
      },
      {
        path: 'members',
        component: EditMembersPage,
        data: {
          state: 'admin-team-members',
        },
      },
      {
        path: 'new_transfert',
        component: NewTransfertPage,
        data: {
          state: 'admin-new-transferts',
        },
      },
      {
        path: 'score/edit',
        component: ScoreEditPage,
        data: {
          state: 'admin-score-edit',
        },
      },
    ],
  },
] as Array<Route>;
