import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DispositionListComponent } from './disposition-list/disposition-list.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DispositionListComponent
  ],
  declarations: [
    DispositionListComponent
  ]
})
export class DispositionModule { }
