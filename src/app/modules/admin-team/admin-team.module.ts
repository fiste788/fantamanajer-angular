import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmationDialogModule } from '@modules/confirmation-dialog/confirmation-dialog.module';
import { LineupModule } from '@modules/lineup/lineup.module';
import { MemberCommonModule } from '@modules/member-common/member-common.module';
import { ScoreModule } from '@modules/score/score.module';
import { TeamModule } from '@modules/team/team.module';
import { TransfertModule } from '@modules/transfert/transfert.module';
import { SharedModule } from '@shared/shared.module';

import { AdminTeamRoutingModule } from './admin-team-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminTeamRoutingModule,
    TeamModule,
    MemberCommonModule,
    LineupModule,
    TransfertModule,
    ReactiveFormsModule,
    ScoreModule,
    ConfirmationDialogModule
  ],
  declarations: [
    AdminTeamRoutingModule.components
  ]
})
export class AdminTeamModule { }
