import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { MemberCommonModule } from '@app/modules/member-common/member-common.module';
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
  declarations: [LineupDetailComponent, LineupLastComponent],
})
export class LineupModule { }
