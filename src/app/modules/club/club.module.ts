import { NgModule } from '@angular/core';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { StreamComponent } from '@modules/stream/components/stream.component';
import { SharedModule } from '@shared/shared.module';

import { ClubRoutingModule } from './club-routing.module';

@NgModule({
  declarations: [ClubRoutingModule.components],
  imports: [ClubRoutingModule, MemberCommonModule, SharedModule, StreamComponent],
})
export default class ClubModule {}
