import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ArticleComponent } from './article.component';
import { ArticleListComponent } from './article-list.component';
import { ArticleDetailComponent } from './article-detail.component'
import { ArticleService } from './article.service';
import { ArticleUniqueComponent } from './article-unique/article-unique.component';
import { ArticleRoutingModule } from './article-routing.module';


@NgModule({
  imports: [
    SharedModule,
    ArticleRoutingModule
  ],
  declarations: [
    ArticleComponent,
    ArticleListComponent,
    ArticleDetailComponent,
    ArticleUniqueComponent
  ],
  providers: [ArticleService]
})
export class ArticleModule { }
