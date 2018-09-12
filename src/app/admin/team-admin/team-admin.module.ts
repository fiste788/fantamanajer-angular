import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TeamAdminComponent } from './team-admin/team-admin.component';
import { TeamModule } from '../../entities/team/team.module';
import { MemberCommonModule } from '../../entities/member/member-common.module';
import { TeamAdminRoutingModule } from './team-admin-routing.module';
import { EditMembersComponent } from './edit-members/edit-members.component';

@NgModule({
  imports: [
    SharedModule,
    TeamAdminRoutingModule,
    TeamModule,
    MemberCommonModule
  ],
  declarations: [
    EditMembersComponent,
    TeamAdminComponent
  ],
})
export class TeamAdminModule { }
