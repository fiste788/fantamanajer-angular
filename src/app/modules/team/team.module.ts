import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ngfModule } from 'angular-file';

import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { NotificationSubscriptionModule } from '@modules/notification-subscription/notification-subscription.module';
import { StreamModule } from '@modules/stream/stream.module';
import { SharedModule } from '@shared/shared.module';

import { TeamEditModal } from './modals/team-edit/team-edit.modal';
import { TeamDetailResolver } from './pages/team-detail/team-detail-resolver.service';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  declarations: [TeamEditModal, TeamRoutingModule.components],
  imports: [
    MatDialogModule,
    MemberCommonModule,
    ngfModule,
    NotificationSubscriptionModule,
    SharedModule,
    StreamModule,
    TeamRoutingModule,
  ],
  providers: [TeamDetailResolver],
})
export default class TeamModule {}
