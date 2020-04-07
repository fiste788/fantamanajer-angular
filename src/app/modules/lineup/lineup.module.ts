import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

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
  declarations: [
    LineupDetailComponent,
    LineupRoutingModule.components
  ]
})
export class LineupModule { }
