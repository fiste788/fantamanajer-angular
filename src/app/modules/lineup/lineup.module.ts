import { NgModule } from '@angular/core';

import { LineupCommonModule } from '@modules/lineup-common/lineup-common.module';
import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

import { LineupRoutingModule } from './lineup-routing.module';

@NgModule({
  declarations: [LineupRoutingModule.components],
  imports: [SharedModule, LineupCommonModule, LineupRoutingModule, MemberCommonModule],
})
export class LineupModule {}
