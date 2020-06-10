import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfirmationDialogModule } from '@modules/confirmation-dialog/confirmation-dialog.module';
import { LineupCommonModule } from '@modules/lineup-common/lineup-common.module';
import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { SharedModule } from '@shared/shared.module';

import { AdminTeamRoutingModule } from './admin-team-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminTeamRoutingModule,
    MemberCommonModule,
    LineupCommonModule,
    ConfirmationDialogModule
  ],
  declarations: [
    AdminTeamRoutingModule.components
  ]
})
export class AdminTeamModule { }
