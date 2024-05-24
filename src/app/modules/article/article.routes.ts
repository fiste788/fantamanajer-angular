import { Route } from '@angular/router';

import { RouterOutletComponent } from '@shared/components/router-outlet';

import { ArticleDetailPage } from './pages/article-detail/article-detail.page';
import { ArticleListPage } from './pages/article-list/article-list.page';

export default [
  {
    path: '',
    component: RouterOutletComponent,
    children: [
      {
        path: '',
        component: ArticleListPage,
        data: { state: 'article-list' },
      },
      {
        path: 'new',
        component: ArticleDetailPage,
        data: {
          breadcrumbs: 'Nuovo articolo',
          state: 'article-new',
        },
      },
      {
        path: ':id',
        component: ArticleDetailPage,
        data: { state: 'article-detail' },
      },
    ],
  },
] as Array<Route>;
