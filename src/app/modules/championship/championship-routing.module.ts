/* eslint-disable @typescript-eslint/promise-function-async */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '@app/guards';
import { Championship } from '@data/types';

import { ChampionshipResolver } from './pages/championship/championship-resolve.service';
import { ChampionshipPage } from './pages/championship/championship.page';
import { ChampionshipStreamPage } from './pages/championship-stream/championship-stream.page';

const routes: Routes = [
  {
    path: ':championship_id',
    component: ChampionshipPage,
    data: {
      breadcrumbs: (data: { championship: Championship }): string =>
        `${data.championship.league.name}`,
      state: 'championship',
    },
    resolve: {
      championship: ChampionshipResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'teams',
      },
      {
        path: 'articles',
        data: { state: 'articles' },
        loadChildren: () => import('@modules/article/article.module'),
      },
      {
        path: 'teams',
        data: { state: 'teams' },
        loadChildren: () => import('@modules/team/team.module'),
      },
      {
        path: 'members',
        data: { state: 'members' },
        loadChildren: () => import('@modules/member/member.module'),
      },
      {
        path: 'ranking',
        data: { state: 'ranking' },
        loadChildren: () => import('@modules/score/score.module'),
      },
      {
        path: 'stream',
        component: ChampionshipStreamPage,
        data: { state: 'stream' },
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        data: { state: 'championship-admin' },
        loadChildren: () => import('@modules/admin-championship/admin-championship.module'),
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class ChampionshipRoutingModule {
  public static components = [ChampionshipPage, ChampionshipStreamPage];
}
