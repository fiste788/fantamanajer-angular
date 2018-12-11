import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk-experimental/scrolling';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { SharedModule } from '@app/shared/shared.module';
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
  ],
})
export class StreamModule { }
