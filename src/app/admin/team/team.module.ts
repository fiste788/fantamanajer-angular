import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TeamComponent } from './team/team.component';
import { TeamModule as TeamUserModule } from '../../entities/team/team.module';
import { MemberCommonModule } from '../../entities/member/member-common.module';
import { TeamRoutingModule } from './team-routing.module';
import { EditMembersComponent } from './edit-members/edit-members.component';
import { NewTransfertComponent } from './new-transfert/new-transfert.component';
import { TransfertModule } from '../../entities/transfert/transfert.module';
import { HomeComponent } from './home/home.component';
import { ConfirmationDialogModule } from '../../shared/confirmation-dialog/confirmation-dialog.module';
import { ScoreEditComponent } from './score-edit/score-edit.component';
import { ScoreModule } from '../../entities/score/score.module';
import { LineupModule } from '../../entities/lineup/lineup.module';

@NgModule({
  imports: [
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
