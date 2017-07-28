import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TransfertService } from './transfert.service';
import { TransfertRoutingModule } from './transfert-routing.module';
import { TransfertListComponent } from './transfert-list/transfert-list.component';

@NgModule({
  imports: [
    SharedModule,
    TransfertRoutingModule
  ],
  declarations: [TransfertListComponent],
  providers: [TransfertService]
})
export class TransfertModule { }
