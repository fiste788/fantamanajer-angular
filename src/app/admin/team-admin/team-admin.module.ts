import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TeamAdminComponent } from './team-admin/team-admin.component';
import { TeamModule } from '../../entities/team/team.module';
import { MemberCommonModule } from '../../entities/member/member-common.module';
import { TeamAdminRoutingModule } from './team-admin-routing.module';
import { EditMembersComponent } from './edit-members/edit-members.component';
import { NewTransfertComponent } from './new-transfert/new-transfert.component';
import { TransfertModule } from '../../entities/transfert/transfert.module';
import { HomeComponent } from './home/home.component';
import { ConfirmationDialogModule } from '../../shared/confirmation-dialog/confirmation-dialog.module';

@NgModule({
  imports: [
    SharedModule,
    TeamAdminRoutingModule,
    TeamModule,
    MemberCommonModule,
    TransfertModule,
    ConfirmationDialogModule
  ],
  declarations: [
    EditMembersComponent,
    TeamAdminComponent,
    NewTransfertComponent,
    HomeComponent,
  ]
})
export class TeamAdminModule { }
