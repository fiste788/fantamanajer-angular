import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MemberModule } from '../member/member.module';
import { TeamComponent } from './team.component';
import { TeamListComponent } from './team-list.component';
import { TeamDetailComponent } from './team-detail.component';
import { TeamService } from './team.service';
import { TeamRoutingModule } from './team-routing.module';
import { TeamMembersComponent } from './team-members/team-members.component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    SharedModule,
    TeamRoutingModule,
    MemberModule,
    FileUploadModule
  ],
  declarations: [
    TeamComponent,
    TeamListComponent,
    TeamDetailComponent,
    TeamMembersComponent
  ],
  providers: [TeamService]
})
export class TeamModule { }
