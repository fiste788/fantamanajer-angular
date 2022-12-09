import { NgModule } from '@angular/core';

import { SelectionComponent } from '@modules/selection/components/selection/selection.component';
import { SharedModule } from '@shared/shared.module';

import { TransfertRoutingModule } from './transfert-routing.module';

@NgModule({
  declarations: [TransfertRoutingModule.components],
  imports: [SelectionComponent, SharedModule, TransfertRoutingModule],
})
export default class TransfertModule {}
