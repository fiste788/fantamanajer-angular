import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { ClubComponent } from './club/club.component';
import { ClubService } from './club.service';
import { ClubRoutingModule } from './club-routing.module';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubDetailComponent } from './club-detail/club-detail.component';
import { ClubDetailResolver } from './club-detail/club-detail-resolver.service';
import { MemberCommonModule } from '../member/member-common.module';
import { ClubMembersComponent } from './club-members/club-members.component';
import { ClubStreamComponent } from './club-stream/club-stream.component';
import { StreamModule } from '../../shared/stream/stream.module';

@NgModule({
  imports: [
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
    ClubService,
    ClubDetailResolver
  ]
})
export class ClubModule { }
