import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LineupCommonModule } from '@modules/lineup-common/lineup-common.module';
import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

import { LineupRoutingModule } from './lineup-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LineupCommonModule,
    LineupRoutingModule,
    MemberCommonModule
  ],
  declarations: [
    LineupRoutingModule.components
  ]
})
export class LineupModule { }
