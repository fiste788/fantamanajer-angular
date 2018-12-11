import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { MemberCommonModule } from '@app/modules/member/member-common.module';
import { LineupComponent } from './pages/lineup/lineup.component';
import { LineupLastComponent } from './pages/lineup-last/lineup-last.component';
import { LineupDetailComponent } from './components/lineup-detail/lineup-detail.component';
import { LineupRoutingModule } from './lineup-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LineupRoutingModule,
    MemberCommonModule
  ],
  exports: [
    LineupDetailComponent
  ],
  declarations: [LineupComponent, LineupDetailComponent, LineupLastComponent],
})
export class LineupModule { }
