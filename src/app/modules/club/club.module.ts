import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { MemberCommonModule } from '@app/modules/member-common/member-common.module';

import { ClubRoutingModule } from './club-routing.module';
import { ClubListComponent } from './pages/club-list/club-list.component';
import { ClubDetailComponent } from './pages/club-detail/club-detail.component';
import { ClubDetailResolver } from './pages/club-detail/club-detail-resolver.service';
import { ClubMembersComponent } from './pages/club-members/club-members.component';
import { ClubStreamComponent } from './pages/club-stream/club-stream.component';
import { StreamModule } from '@app/modules/stream/stream.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ClubRoutingModule,
    MemberCommonModule,
    StreamModule
  ],
  declarations: [
    ClubListComponent,
    ClubDetailComponent,
    ClubMembersComponent,
    ClubStreamComponent
  ],
  providers: [
    ClubDetailResolver
  ]
})
export class ClubModule { }
