import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { ContentLoaderModule } from '@netbasal/content-loader';
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
