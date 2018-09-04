import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { StreamComponent } from './stream.component';
import { StreamService } from './stream.service';

@NgModule({
  imports: [
    SharedModule
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
