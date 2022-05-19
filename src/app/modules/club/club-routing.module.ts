import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Club } from '@data/types';
import { RouterOutletComponent } from '@shared/components';

import { ClubDetailResolver } from './pages/club-detail/club-detail-resolver.service';
import { ClubDetailPage } from './pages/club-detail/club-detail.page';
import { ClubListPage } from './pages/club-list/club-list.page';
import { ClubMembersPage } from './pages/club-members/club-members.page';
import { ClubStreamPage } from './pages/club-stream/club-stream.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: {
      breadcrumbs: 'Club',
      state: 'club-outlet',
    },
    children: [
      {
        path: '',
        component: ClubListPage,
        data: { state: 'club-list' },
      },
      {
        path: ':id',
        component: ClubDetailPage,
        data: {
          breadcrumbs: (data: { club: Club }): string => `${data.club.name}`,
          state: 'club-detail',
        },
        resolve: {
          club: ClubDetailResolver,
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
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class ClubRoutingModule {
  public static components = [ClubListPage, ClubDetailPage, ClubMembersPage, ClubStreamPage];
}
