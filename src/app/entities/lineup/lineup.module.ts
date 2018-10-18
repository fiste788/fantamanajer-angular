import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { LineupRoutingModule } from './lineup-routing.module';
import { LineupService } from './lineup.service';
import { LineupComponent } from './lineup/lineup.component';
import { LineupDetailComponent } from './lineup-detail/lineup-detail.component';
import { MemberCommonModule } from '../member/member-common.module';
import { LineupLastComponent } from './lineup-last/lineup-last.component';

@NgModule({
  imports: [
    SharedModule,
    LineupRoutingModule,
    MemberCommonModule
  ],
  exports: [
    LineupDetailComponent
  ],
  declarations: [LineupComponent, LineupDetailComponent, LineupLastComponent],
  providers: [LineupService]
})
export class LineupModule { }
