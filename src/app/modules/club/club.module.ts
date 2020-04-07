import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { StreamModule } from '@modules/stream/stream.module';
import { SharedModule } from '@shared/shared.module';

import { ClubRoutingModule } from './club-routing.module';
import { ClubDetailResolver } from './pages/club-detail/club-detail-resolver.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ClubRoutingModule,
    MemberCommonModule,
    StreamModule
  ],
  declarations: [
    ClubRoutingModule.components
  ],
  providers: [
    ClubDetailResolver
  ]
})
export class ClubModule { }
