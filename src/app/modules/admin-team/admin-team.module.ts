import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TeamModule } from '@app/modules/team/team.module';
import { MemberCommonModule } from '@app/modules/member-common/member-common.module';
import { TransfertModule } from '@app/modules/transfert/transfert.module';
import { ScoreModule } from '@app/modules/score/score.module';
import { LineupModule } from '@app/modules/lineup/lineup.module';
import { ConfirmationDialogModule } from '@app/modules/confirmation-dialog/confirmation-dialog.module';
import { TeamComponent } from './pages/team/team.component';
import { EditMembersComponent } from './pages/edit-members/edit-members.component';
import { NewTransfertComponent } from './pages/new-transfert/new-transfert.component';
import { HomeComponent } from './pages/home/home.component';
import { ScoreEditComponent } from './pages/score-edit/score-edit.component';
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
export class AdminTeamModule { }
