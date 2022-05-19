import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouterOutletComponent } from '@shared/components';

import { RankingPage } from './pages/ranking/ranking.page';
import { ScoreDetailPage } from './pages/score-detail/score-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'score-outlet' },
    children: [
      {
        path: '',
        component: RankingPage,
        data: {
          state: 'ranking',
        },
      },
      {
        path: ':id',
        component: ScoreDetailPage,
        data: {
          state: 'details',
        },
      },
      {
        path: 'last',
        component: ScoreDetailPage,
        data: {
          state: 'last',
        },
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class ScoreRoutingModule {
  public static components = [RankingPage, ScoreDetailPage];
}
