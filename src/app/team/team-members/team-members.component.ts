import { Team } from '../team';
import { TeamService } from '../team.service';
import { Component, OnInit, Injector } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MemberListComponent } from '../../member/member-list/member-list.component';
import { TeamDetailComponent } from '../team-detail.component';

@Component({
  selector: 'fm-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {

  team: Team;

  constructor(public snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private teamService: TeamService,
    private inj: Injector) { }

  ngOnInit() {
    const parentComponent = this.inj.get(TeamDetailComponent);
    console.log(parentComponent);
    if (parentComponent.team) {
      this.team = parentComponent.team
    } else {
      parentComponent.selectedTeam.subscribe(team => this.team = team)
    }
    // this.team = parentComponent.team;
    /*const id = parseInt(this.route.snapshot.params['id'], 10);
    console.log(id);
    this.teamService.getTeam(id).then(team => this.team = team);*/
  }

}
