import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DispositionListComponent } from './disposition-list/disposition-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DispositionListComponent,
    RouterModule
  ],
  declarations: [
    DispositionListComponent
  ]
})
export class DispositionModule { }
