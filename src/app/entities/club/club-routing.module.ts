import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubComponent } from './club/club.component';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubDetailComponent } from './club-detail/club-detail.component';
import { ClubDetailResolver } from './club-detail/club-detail-resolver.service';
import { ClubMembersComponent } from './club-members/club-members.component';
import { ClubStreamComponent } from './club-stream/club-stream.component';

const routes: Routes = [
  {
    path: '',
    component: ClubComponent,
    data: {
      breadcrumbs: 'Club'
    },
    children: [
      {
        path: '',
        component: ClubListComponent
      },
      {
        path: ':id',
        component: ClubDetailComponent,
        data: {
          breadcrumbs: '{{club.name}}'
        },
        resolve: {
          club: ClubDetailResolver
        },
        children: [
          { path: '', redirectTo: 'players', pathMatch: 'full' },
          { path: 'players', component: ClubMembersComponent },
          { path: 'stream', component: ClubStreamComponent },
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
