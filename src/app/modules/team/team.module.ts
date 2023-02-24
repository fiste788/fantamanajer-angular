import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ngfModule } from 'angular-file';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { NotificationSubscriptionComponent } from '@modules/notification-subscription/components/notification-subscription/notification-subscription.component';
import { StreamComponent } from '@modules/stream/components/stream.component';
import { SharedModule } from '@shared/shared.module';

import { TeamEditModal } from './modals/team-edit/team-edit.modal';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  declarations: [TeamEditModal, TeamRoutingModule.components],
  imports: [
    MatDialogModule,
    MemberCommonModule,
    ngfModule,
    NotificationSubscriptionComponent,
    SharedModule,
    StreamComponent,
    TeamRoutingModule,
  ],
})
export default class TeamModule {}
