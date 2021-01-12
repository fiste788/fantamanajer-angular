import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { ContentLoaderModule } from '@netbasal/content-loader';

import { SharedModule } from '@shared/shared.module';

import { StreamComponent } from './components/stream.component';

@NgModule({
  declarations: [StreamComponent],
  exports: [StreamComponent],
  imports: [SharedModule, ScrollingModule, ContentLoaderModule],
})
export class StreamModule {}
