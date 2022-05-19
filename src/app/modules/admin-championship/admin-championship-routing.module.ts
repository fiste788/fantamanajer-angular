import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouterOutletComponent } from '@shared/components';

import { AddTeamPage } from './pages/add-team/add-team.page';
import { ChampionshipDetailPage } from './pages/championship-detail/championship-detail.page';
import { HomePage } from './pages/home/home.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'index',
        data: {
          state: 'admin-championship-outlet',
        },
      },
      {
        path: 'index',
        component: HomePage,
        data: {
          state: 'admin-championship-home',
        },
      },
      {
        path: 'add-team',
        component: AddTeamPage,
        data: {
          state: 'admin-add-team',
        },
      },
      {
        path: 'edit',
        component: ChampionshipDetailPage,
        data: {
          state: 'admin-edit',
        },
      },
      {
        path: 'new',
        component: ChampionshipDetailPage,
        data: {
          breadcrumbs: 'Nuova lega',
          data: { state: 'admin-championship-detail' },
        },
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class AdminChampionshipRoutingModule {
  public static components = [HomePage, AddTeamPage, ChampionshipDetailPage];
}
