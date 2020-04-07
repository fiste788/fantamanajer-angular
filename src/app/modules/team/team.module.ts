import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ngfModule } from 'angular-file';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { NotificationSubscriptionModule } from '@modules/notification-subscription/notification-subscription.module';
import { StreamModule } from '@modules/stream/stream.module';
import { SharedModule } from '@shared/shared.module';

import { TeamEditDialogComponent } from './modals/team-edit-dialog/team-edit-dialog.component';
import { TeamDetailResolver } from './pages/team-detail/team-detail-resolver.service';
import { TeamDetailComponent } from './pages/team-detail/team-detail.component';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { TeamMembersComponent } from './pages/team-members/team-members.component';
import { TeamStreamComponent } from './pages/team-stream/team-stream.component';
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
    TeamListComponent,
    TeamDetailComponent,
    TeamMembersComponent,
    TeamEditDialogComponent,
    TeamStreamComponent
  ],
  providers: [
    TeamDetailResolver
  ]
})
export class TeamModule { }
