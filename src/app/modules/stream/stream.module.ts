import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { ContentLoaderModule } from '@ngneat/content-loader';

import { SharedModule } from '@shared/shared.module';

import { StreamComponent } from './components/stream.component';

@NgModule({
  declarations: [StreamComponent],
  exports: [StreamComponent],
  imports: [ContentLoaderModule, ScrollingModule, SharedModule],
})
export class StreamModule {}
