import { NgModule } from '@angular/core';

import { ConfirmationDialogModal } from '@modules/confirmation-dialog/modals/confirmation-dialog.modal';
import { LineupCommonModule } from '@modules/lineup-common/lineup-common.module';
import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

import { AdminTeamRoutingModule } from './admin-team-routing.module';

@NgModule({
  declarations: [AdminTeamRoutingModule.components],
  imports: [
    AdminTeamRoutingModule,
    ConfirmationDialogModal,
    LineupCommonModule,
    MemberCommonModule,
    SharedModule,
  ],
})
export default class AdminTeamModule {}
