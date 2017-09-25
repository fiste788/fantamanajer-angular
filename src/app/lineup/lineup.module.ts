import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { LineupRoutingModule } from './lineup-routing.module';
import { LineupService } from './lineup.service';
import { LineupComponent } from './lineup.component';
import { LineupDetailComponent } from './lineup-detail/lineup-detail.component';

@NgModule({
  imports: [
    SharedModule,
    LineupRoutingModule
  ],
  declarations: [LineupComponent, LineupDetailComponent],
  providers: [LineupService]
})
export class LineupModule { }
