import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TeamModule as TeamUserModule } from '@app/modules/team/team.module';
import { MemberCommonModule } from '@app/modules/member-common/member-common.module';
import { TransfertModule } from '@app/modules/transfert/transfert.module';
import { ScoreModule } from '@app/modules/score/score.module';
import { LineupModule } from '@app/modules/lineup/lineup.module';
import { ConfirmationDialogModule } from '@app/modules/confirmation-dialog/confirmation-dialog.module';
import { TeamComponent } from './team/team.component';
import { EditMembersComponent } from './edit-members/edit-members.component';
import { NewTransfertComponent } from './new-transfert/new-transfert.component';
import { HomeComponent } from './home/home.component';
import { ScoreEditComponent } from './score-edit/score-edit.component';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TeamRoutingModule,
    TeamUserModule,
    MemberCommonModule,
    LineupModule,
    TransfertModule,
    ScoreModule,
    ConfirmationDialogModule
  ],
  declarations: [
    EditMembersComponent,
    TeamComponent,
    NewTransfertComponent,
    HomeComponent,
    ScoreEditComponent,
  ],
})
export class TeamModule { }
