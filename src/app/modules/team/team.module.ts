import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { MemberCommonModule } from '@app/modules/member-common/member-common.module';
import { ngfModule } from 'angular-file';
import { TeamComponent } from './pages/team/team.component';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { TeamDetailComponent } from './pages/team-detail/team-detail.component';
import { TeamMembersComponent } from './components/team-members/team-members.component';
import { TeamEditDialogComponent } from './modals/team-edit-dialog/team-edit-dialog.component';
import { TeamDetailResolver } from './pages/team-detail/team-detail-resolver.service';
import { NotificationSubscriptionModule } from '../notification-subscription/notification-subscription.module';
import { TeamStreamComponent } from './components/team-stream/team-stream.component';
import { StreamModule } from '@app/modules/stream/stream.module';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TeamRoutingModule,
    MemberCommonModule,
    MatDialogModule,
    NotificationSubscriptionModule,
    StreamModule,
    ngfModule
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
    TeamDetailResolver
  ]
})
export class TeamModule { }
