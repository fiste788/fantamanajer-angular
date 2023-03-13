import { Route } from '@angular/router';

import { RouterOutletComponent } from '@shared/components';

import { RankingPage } from './pages/ranking/ranking.page';
import { ScoreDetailPage } from './pages/score-detail/score-detail.page';

export default [
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
] as Array<Route>;
