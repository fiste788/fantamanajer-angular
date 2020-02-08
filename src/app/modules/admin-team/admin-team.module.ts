import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmationDialogModule } from '@app/modules/confirmation-dialog/confirmation-dialog.module';
import { LineupModule } from '@app/modules/lineup/lineup.module';
import { MemberCommonModule } from '@app/modules/member-common/member-common.module';
import { ScoreModule } from '@app/modules/score/score.module';
import { TeamModule } from '@app/modules/team/team.module';
import { TransfertModule } from '@app/modules/transfert/transfert.module';
import { SharedModule } from '@app/shared/shared.module';
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
