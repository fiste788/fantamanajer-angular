import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ArticleComponent } from './pages/article/article.component';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';

import { ArticleRoutingModule } from './article-routing.module';

@NgModule({
  declarations: [
    ArticleComponent,
    ArticleListComponent,
    ArticleDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule
  ]
})
export class ArticleModule { }
