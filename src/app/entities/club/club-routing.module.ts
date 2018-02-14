import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubComponent } from './club/club.component';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubDetailComponent } from './club-detail/club-detail.component';
import { ClubDetailResolver } from './club-detail/club-detail-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ClubComponent,
    data: {
      breadcrumbs: 'Club'
    },
    children: [
      { path: '', component: ClubListComponent },
      {
        path: ':id',
        component: ClubDetailComponent,
        resolve: {
          club: ClubDetailResolver
        },
        data: {
          breadcrumbs: '{{ club.name }}'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubRoutingModule { }
