import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SelectionModule } from '@modules/selection/selection.module';
import { SharedModule } from '@shared/shared.module';

import { TransfertRoutingModule } from './transfert-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TransfertRoutingModule,
    SelectionModule
  ],
  declarations: [
    TransfertRoutingModule.components
  ]
})
export class TransfertModule { }
