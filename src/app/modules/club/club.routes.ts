import type { Route } from '@angular/router';

import type { Club } from '@data/interfaces';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { ClubDetailPage } from './pages/club-detail/club-detail.page';
import { clubResolver } from './pages/club-detail/club.resolver';
import { ClubListPage } from './pages/club-list/club-list.page';
import { clubsResolver } from './pages/club-list/club-list.resolver';
import { ClubMembersPage } from './pages/club-members/club-members.page';
import { ClubStreamPage } from './pages/club-stream/club-stream.page';

export default [
  {
    children: [
      {
        component: ClubListPage,
        data: { breadcrumbs: 'Club', exit: true, state: 'club-list' },
        path: '',
        resolve: {
          clubs: clubsResolver,
        },
      },
      {
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'players',
          },
          {
            component: ClubMembersPage,
            data: { parent: true, state: 'players' },
            path: 'players',
          },
          {
            component: ClubStreamPage,
            data: { state: 'stream' },
            path: 'stream',
          },
        ],
        component: ClubDetailPage,
        data: {
          breadcrumbs: (data: { club: Club }): string => data.club.name,
          description: 'Club',
          exit: true,
          ogDescription: 'Club',
          ogImage: (data: { club: Club }): string | undefined => data.club.photo_url ?? undefined,
          ogTitle: (data: { club: Club }): string => data.club.name,
          robots: 'nofollow,index',
          state: 'club-outlet',
        },
        path: ':id',
        resolve: {
          club: clubResolver,
        },
      },
    ],
    component: RouterOutletComponent,
    data: {
      state: 'club-outlet',
    },
    path: '',
  },
] satisfies Route[];
