import { NgModule } from '@angular/core';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { TeamModule } from '../entities/team/team.module';
import { MemberCommonModule } from '../entities/member/member-common.module';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    TeamModule,
    MemberCommonModule
  ],
  declarations: [
    TeamEditComponent,
    AdminComponent
  ],
})
export class AdminModule { }
