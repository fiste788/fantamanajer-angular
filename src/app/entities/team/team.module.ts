import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { MemberCommonModule } from '../member/member-common.module';
import { TeamComponent } from './team/team.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamService } from './team.service';
import { TeamRoutingModule } from './team-routing.module';
import { TeamMembersComponent } from './team-members/team-members.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MatDialogModule } from '@angular/material/dialog';
import { TeamEditDialogComponent } from './team-edit-dialog/team-edit-dialog.component';
import { TeamDetailResolver } from './team-detail/team-detail-resolver.service';
import { NotificationSubscriptionModule } from '../notification-subscription/notification-subscription.module';
import { TeamStreamComponent } from './team-stream/team-stream.component';
import { StreamModule } from '../../shared/stream/stream.module';

@NgModule({
  imports: [
    SharedModule,
    TeamRoutingModule,
    MemberCommonModule,
    FileUploadModule,
    MatDialogModule,
    NotificationSubscriptionModule,
    StreamModule
  ],
  declarations: [
    TeamComponent,
    TeamListComponent,
    TeamDetailComponent,
    TeamMembersComponent,
    TeamEditDialogComponent,
    TeamStreamComponent
  ],
  entryComponents: [
    TeamEditDialogComponent
  ],
  providers: [
    TeamService,
    TeamDetailResolver
  ]
})
export class TeamModule { }
