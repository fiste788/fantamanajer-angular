import { Routes } from '@angular/router';

import { RouterOutletComponent } from '@shared/components';

import { ArticleDetailPage } from './pages/article-detail/article-detail.page';
import { ArticleListPage } from './pages/article-list/article-list.page';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'article-outlet' },
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
];

export default routes;
