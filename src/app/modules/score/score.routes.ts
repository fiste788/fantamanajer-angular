import { Route } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { RankingPage } from './pages/ranking/ranking.page';
import { ScoreDetailPage } from './pages/score-detail/score-detail.page';

export default [
  {
    path: '',
    canActivate: [authenticatedGuard],
    component: RouterOutletComponent,
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
] satisfies Array<Route>;
