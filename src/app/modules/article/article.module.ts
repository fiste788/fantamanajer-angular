import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { ArticleListComponent } from './pages/article-list/article-list.component';

import { ArticleRoutingModule } from './article-routing.module';

@NgModule({
  declarations: [
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
