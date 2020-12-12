import { NgModule } from '@angular/core';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { StreamModule } from '@modules/stream/stream.module';
import { SharedModule } from '@shared/shared.module';

import { ClubRoutingModule } from './club-routing.module';
import { ClubDetailResolver } from './pages/club-detail/club-detail-resolver.service';

@NgModule({
  declarations: [
    ClubRoutingModule.components,
  ],
  imports: [
    SharedModule,
    ClubRoutingModule,
    MemberCommonModule,
    StreamModule,
  ],
  providers: [
    ClubDetailResolver,
  ],
})
export class ClubModule { }
