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
import { EditMembersComponent } from './pages/edit-members/edit-members.component';
import { HomeComponent } from './pages/home/home.component';
import { NewTransfertComponent } from './pages/new-transfert/new-transfert.component';
import { ScoreEditComponent } from './pages/score-edit/score-edit.component';

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
    EditMembersComponent,
    NewTransfertComponent,
    HomeComponent,
    ScoreEditComponent
  ]
})
export class AdminTeamModule { }
