import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { LineupRoutingModule } from './lineup-routing.module';
import { LineupService } from './lineup.service';
import { LineupComponent } from './lineup/lineup.component';
import { LineupDetailComponent } from './lineup-detail/lineup-detail.component';
import { MemberCommonModule } from '../member/member-common.module';

@NgModule({
  imports: [
    SharedModule,
    LineupRoutingModule,
    MemberCommonModule
  ],
  declarations: [LineupComponent, LineupDetailComponent],
  providers: [LineupService]
})
export class LineupModule { }
