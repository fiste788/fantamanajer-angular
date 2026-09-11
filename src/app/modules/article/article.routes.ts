import type { Route } from '@angular/router';

import { authenticatedGuard } from '@app/guards';
import { RouterOutletComponent } from '@shared/components/router-outlet';

import { ArticleDetailPage } from './pages/article-detail/article-detail.page';
import { ArticleListPage } from './pages/article-list/article-list.page';

export default [
  {
    canActivate: [authenticatedGuard],
    children: [
      {
        component: ArticleListPage,
        data: { state: 'article-list' },
        path: '',
      },
      {
        component: ArticleDetailPage,
        data: {
          breadcrumbs: 'Nuovo articolo',
          state: 'article-new',
        },
        path: 'new',
      },
      {
        component: ArticleDetailPage,
        data: { state: 'article-detail' },
        path: ':id',
      },
    ],
    component: RouterOutletComponent,
    path: '',
  },
] satisfies Route[];
