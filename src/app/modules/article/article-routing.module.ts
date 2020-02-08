import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterOutletComponent } from '@app/shared/components/router-outlet/router-outlet.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { ArticleListComponent } from './pages/article-list/article-list.component';

const routes: Routes = [
  {
    path: '',
    component: RouterOutletComponent,
    data: { state: 'article-outlet' },
    children: [
      {
        path: '',
        component: ArticleListComponent,
        data: { state: 'article-list' }
      },
      {
        path: 'new',
        component: ArticleDetailComponent,
        data: {
          state: 'article-new',
          breadcrumbs: 'Nuovo articolo'
        }
      },
      {
        path: ':id',
        component: ArticleDetailComponent,
        data: { state: 'article-detail' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
