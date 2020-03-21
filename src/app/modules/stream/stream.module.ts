import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { SharedModule } from '@shared/shared.module';

import { StreamComponent } from './components/stream.component';

@NgModule({
  imports: [
    SharedModule,
    ScrollingModule,
    ContentLoaderModule
  ],
  declarations: [
    StreamComponent
  ],
  exports: [
    StreamComponent
  ]
})
export class StreamModule { }
