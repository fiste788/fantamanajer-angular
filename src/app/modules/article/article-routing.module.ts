import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { ArticleComponent } from './pages/article/article.component';

const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    children: [
      {
        path: '',
        component: ArticleListComponent
      },
      {
        path: 'new',
        component: ArticleDetailComponent,
        data: {
          breadcrumbs: 'Nuovo articolo'
        }
      },
      {
        path: ':id',
        component: ArticleDetailComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
