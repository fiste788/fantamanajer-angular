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
    TeamEditDialogComponent,
    TeamRoutingModule.components
  ],
  providers: [
    TeamDetailResolver
  ]
})
export class TeamModule { }
