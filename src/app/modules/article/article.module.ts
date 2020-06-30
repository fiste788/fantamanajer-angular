import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ArticleRoutingModule } from './article-routing.module';

@NgModule({
  declarations: [
    ArticleRoutingModule.components,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule,
  ],
})
export class ArticleModule { }
