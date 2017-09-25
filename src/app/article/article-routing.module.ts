import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './article.component';
import { ArticleUniqueComponent } from './article-unique/article-unique.component';
import { ArticleListComponent } from './article-list.component';
import { ArticleDetailComponent } from './article-detail.component';

const routes: Routes = [
  { path: '',
    children: [
      { path: '',    component: ArticleListComponent },
      { path: 'unique', component: ArticleUniqueComponent, children: [
      { path: 'create_article', component: ArticleDetailComponent, outlet: 'popup'},
      { path: ':id', component: ArticleDetailComponent },
    ]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {}
