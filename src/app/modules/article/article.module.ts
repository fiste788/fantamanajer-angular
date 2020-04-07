import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ArticleRoutingModule } from './article-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule
  ],
  declarations: [
    ArticleRoutingModule.components
  ]
})
export class ArticleModule { }
