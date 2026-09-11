import type { Route } from '@angular/router';

import { RouterOutletComponent } from '@shared/components/router-outlet';

import { AddTeamPage } from './pages/add-team/add-team.page';
import { ChampionshipDetailPage } from './pages/championship-detail/championship-detail.page';
import { HomePage } from './pages/home/home.page';

export default [
  {
    children: [
      {
        data: {
          state: 'admin-championship-outlet',
        },
        path: '',
        pathMatch: 'full',
        redirectTo: 'index',
      },
      {
        component: HomePage,
        data: {
          state: 'admin-championship-home',
        },
        path: 'index',
      },
      {
        component: AddTeamPage,
        data: {
          state: 'admin-add-team',
        },
        path: 'add-team',
      },
      {
        component: ChampionshipDetailPage,
        data: {
          state: 'admin-edit',
        },
        path: 'edit',
      },
      {
        component: ChampionshipDetailPage,
        data: {
          breadcrumbs: 'Nuova lega',
          data: { state: 'admin-championship-detail' },
        },
        path: 'new',
      },
    ],
    component: RouterOutletComponent,
    path: '',
  },
] satisfies Route[];
