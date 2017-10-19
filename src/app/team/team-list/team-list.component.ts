import { Component, OnInit } from '@angular/core';
import { Team } from '../team';
import { TeamService } from '../team.service';


@Component({
  selector: 'fm-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {

  teams: Team[] = [];

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.teamService.getTeams()
      .then(teams => this.teams = teams);
  }

}
