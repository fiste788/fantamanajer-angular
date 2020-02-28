import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterOutletComponent } from '@shared/components/router-outlet/router-outlet.component';
import { ClubDetailResolver } from './pages/club-detail/club-detail-resolver.service';
import { ClubDetailComponent } from './pages/club-detail/club-detail.component';
import { ClubListComponent } from './pages/club-list/club-list.component';
import { ClubMembersComponent } from './pages/club-members/club-members.component';
import { ClubStreamComponent } from './pages/club-stream/club-stream.component';

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
        component: ClubListComponent,
        data: {
          state: 'club-list'
        }
      },
      {
        path: ':id',
        component: ClubDetailComponent,
        data: {
          state: 'club-detail',
          breadcrumbs: '{{club.name}}'
        },
        resolve: {
          club: ClubDetailResolver
        },
        children: [
          { path: '', redirectTo: 'players', pathMatch: 'full' },
          { path: 'players', component: ClubMembersComponent, data: { state: 'players' } },
          { path: 'stream', component: ClubStreamComponent, data: { state: 'stream' } }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubRoutingModule { }
