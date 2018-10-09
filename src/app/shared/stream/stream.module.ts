import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { StreamComponent } from './stream.component';
import { StreamService } from './stream.service';
import { ScrollingModule } from '@angular/cdk-experimental/scrolling';
import { ContentLoaderModule } from '@netbasal/content-loader';

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
  ],
  providers: [
    StreamService
  ]
})
export class StreamModule { }
