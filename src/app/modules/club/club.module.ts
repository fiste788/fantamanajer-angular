import { NgModule } from '@angular/core';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { StreamComponent } from '@modules/stream/components/stream.component';
import { SharedModule } from '@shared/shared.module';

import { ClubRoutingModule } from './club-routing.module';
import { ClubDetailResolver } from './pages/club-detail/club-detail-resolver.service';

@NgModule({
  declarations: [ClubRoutingModule.components],
  imports: [ClubRoutingModule, MemberCommonModule, SharedModule, StreamComponent],
  providers: [ClubDetailResolver],
})
export default class ClubModule {}
