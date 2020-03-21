import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SelectionModule } from '@modules/selection/selection.module';
import { SharedModule } from '@shared/shared.module';

import { TransfertListComponent } from './pages/transfert-list/transfert-list.component';
import { TransfertRoutingModule } from './transfert-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TransfertRoutingModule,
    SelectionModule
  ],
  declarations: [TransfertListComponent]
})
export class TransfertModule { }
