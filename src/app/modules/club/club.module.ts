import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ClubComponent } from './pages/club/club.component';
import { ClubRoutingModule } from './club-routing.module';
import { ClubListComponent } from './pages/club-list/club-list.component';
import { ClubDetailComponent } from './pages/club-detail/club-detail.component';
import { ClubDetailResolver } from './pages/club-detail/club-detail-resolver.service';
import { MemberCommonModule } from '../member/member-common.module';
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
    ClubComponent,
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
