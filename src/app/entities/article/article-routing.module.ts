import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ArticleListComponent },
      {
        path: 'new',
        component: ArticleDetailComponent,
        data: {
          breadcrumbs: 'Nuovo articolo'
        }
      },
      { path: ':id', component: ArticleDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
