import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

import { StreamModule } from '@modules/stream/stream.module';
import { ClubRoutingModule } from './club-routing.module';
import { ClubDetailResolver } from './pages/club-detail/club-detail-resolver.service';
import { ClubDetailComponent } from './pages/club-detail/club-detail.component';
import { ClubListComponent } from './pages/club-list/club-list.component';
import { ClubMembersComponent } from './pages/club-members/club-members.component';
import { ClubStreamComponent } from './pages/club-stream/club-stream.component';

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
