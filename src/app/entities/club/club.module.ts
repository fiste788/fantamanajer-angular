import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { ClubComponent } from './club/club.component';
import { ClubService } from './club.service';
import { ClubRoutingModule } from './club-routing.module';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubDetailComponent } from './club-detail/club-detail.component';
import { ClubDetailResolver } from './club-detail/club-detail-resolver.service';
import { MemberCommonModule } from '../member/member-common.module';

@NgModule({
  imports: [
    SharedModule,
    ClubRoutingModule,
    MemberCommonModule
  ],
  declarations: [
    ClubComponent,
    ClubListComponent,
    ClubDetailComponent
  ],
  providers: [
    ClubService,
    ClubDetailResolver
  ]
})
export class ClubModule { }
