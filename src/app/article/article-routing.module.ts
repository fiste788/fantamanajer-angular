import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './article.component';
import { ArticleListComponent } from './article-list.component';
import { ArticleDetailComponent } from './article-detail.component';

const routes: Routes = [
  { path: '',
    children: [
      { path: '',    component: ArticleListComponent },
      { path: 'create', component: ArticleDetailComponent, outlet: 'popup'},
      { path: ':id', component: ArticleDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {}
