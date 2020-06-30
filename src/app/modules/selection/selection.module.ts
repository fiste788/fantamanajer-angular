import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { SelectionComponent } from './components/selection/selection.component';

@NgModule({
  declarations: [SelectionComponent],
  exports: [SelectionComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
})
export class SelectionModule { }
