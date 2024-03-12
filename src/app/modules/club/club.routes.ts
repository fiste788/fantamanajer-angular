import { Route } from '@angular/router';

import { Club } from '@data/types';
import { RouterOutletComponent } from '@shared/components';

import { ClubDetailPage } from './pages/club-detail/club-detail.page';
import { clubResolver } from './pages/club-detail/club.resolver';
import { ClubListPage } from './pages/club-list/club-list.page';
import { clubsResolver } from './pages/club-list/club-list.resolver';
import { ClubMembersPage } from './pages/club-members/club-members.page';
import { ClubStreamPage } from './pages/club-stream/club-stream.page';

export default [
  {
    path: '',
    component: RouterOutletComponent,
    data: {
      state: 'club-outlet',
    },
    children: [
      {
        path: '',
        component: ClubListPage,
        data: { state: 'club-list', exit: true },
        breadcrumbs: 'Club',
        resolve: {
          clubs: clubsResolver,
        },
      },
      {
        path: ':id',
        component: ClubDetailPage,
        data: {
          breadcrumbs: (data: { club: Club }): string => `${data.club.name}`,
          state: 'club-outlet',
          exit: true,
        },
        resolve: {
          club: clubResolver,
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'players',
          },
          {
            path: 'players',
            component: ClubMembersPage,
            data: { state: 'players' },
          },
          {
            path: 'stream',
            component: ClubStreamPage,
            data: { state: 'stream' },
          },
        ],
      },
    ],
  },
] as Array<Route>;
