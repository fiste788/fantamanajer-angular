import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SelectionModule } from '@app/modules/selection/selection.module';
import { TransfertRoutingModule } from './transfert-routing.module';
import { TransfertListComponent } from './pages/transfert-list/transfert-list.component';

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
