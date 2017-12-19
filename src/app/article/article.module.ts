import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ArticleComponent } from './article/article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleService } from './article.service';
import { ArticleRoutingModule } from './article-routing.module';


@NgModule({
  imports: [
    SharedModule,
    ArticleRoutingModule
  ],
  declarations: [
    ArticleComponent,
    ArticleListComponent,
    ArticleDetailComponent
  ],
  providers: [ArticleService]
})
export class ArticleModule { }
