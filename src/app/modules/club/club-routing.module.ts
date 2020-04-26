import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';

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
      state: 'club-outlet',
      breadcrumbs: 'Club'
    },
    children: [
      {
        path: '',
        component: ClubListPage,
        data: {
          state: 'club-list'
        }
      },
      {
        path: ':id',
        component: ClubDetailPage,
        data: {
          state: 'club-detail',
          breadcrumbs: '{{club.name}}'
        },
        resolve: {
          club: ClubDetailResolver
        },
        children: [
          { path: '', redirectTo: 'players', pathMatch: 'full' },
          { path: 'players', component: ClubMembersPage, data: { state: 'players' } },
          { path: 'stream', component: ClubStreamPage, data: { state: 'stream' } }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubRoutingModule {
  static components = [
    ClubListPage,
    ClubDetailPage,
    ClubMembersPage,
    ClubStreamPage
  ];
}
