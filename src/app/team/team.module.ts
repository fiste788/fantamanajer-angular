import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { TeamComponent } from './team.component';
import { TeamListComponent } from './team-list.component';
import { TeamDetailComponent } from './team-detail.component';
import { TeamService } from './team.service';
import { TeamRoutingModule } from './team-routing.module';
import { TeamMembersComponent } from './team-members/team-members.component';

@NgModule({
  imports: [
    SharedModule,
    TeamRoutingModule
  ],
  declarations: [
    TeamComponent,
    TeamListComponent,
    TeamDetailComponent,
    TeamMembersComponent
  ],
  providers: [TeamService]
})
export class TeamModule { }
