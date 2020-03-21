import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { SelectionComponent } from './components/selection/selection.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [SelectionComponent],
  declarations: [SelectionComponent]
})
export class SelectionModule { }
