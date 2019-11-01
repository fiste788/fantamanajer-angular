import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';

import { DispositionListComponent } from './components/disposition-list/disposition-list.component';

@NgModule({
  imports: [
    CommonModule,
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