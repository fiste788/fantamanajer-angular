import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ArticleComponent } from './article.component';
import { ArticleListComponent } from './article-list.component';
import { ArticleDetailComponent } from './article-detail.component'
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
    ArticleDetailComponent,
  ],
  providers: [ArticleService]
})
export class ArticleModule { }
