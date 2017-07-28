import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ClubComponent } from './club.component';
import { ClubService } from './club.service';
import { ClubRoutingModule } from './club-routing.module';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubDetailComponent } from './club-detail/club-detail.component';
import { MemberModule } from '../member/member.module';

@NgModule({
  imports: [
    SharedModule,
    ClubRoutingModule,
    MemberModule
  ],
  declarations: [
    ClubComponent,
    ClubListComponent,
    ClubDetailComponent
  ],
  providers: [ClubService]
})
export class ClubModule { }
