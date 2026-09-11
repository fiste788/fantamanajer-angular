import type { Route } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { RankingPage } from './pages/ranking/ranking.page';
import { ScoreDetailPage } from './pages/score-detail/score-detail.page';

export default [
  {
    canActivate: [authenticatedGuard],
    children: [
      {
        component: RankingPage,
        data: {
          state: 'ranking',
        },
        path: '',
      },
      {
        component: ScoreDetailPage,
        data: {
          state: 'details',
        },
        path: ':id',
      },
      {
        component: ScoreDetailPage,
        data: {
          state: 'last',
        },
        path: 'last',
      },
    ],
    component: RouterOutletComponent,
    path: '',
  },
] satisfies Route[];
