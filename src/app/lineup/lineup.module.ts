import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { LineupRoutingModule } from './lineup-routing.module';
import { LineupComponent } from './lineup.component';

@NgModule({
  imports: [
    SharedModule,
    LineupRoutingModule
  ],
  declarations: [LineupComponent]
})
export class LineupModule { }
