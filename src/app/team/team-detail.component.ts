import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { Team } from './team';
import { TeamService } from './team.service';

@Component({
  selector: 'fm-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit {

  tabs: { label: string; link: string; }[];
  team: Team;
  @Output() selectedTeam: EventEmitter<Team> = new EventEmitter();

  constructor(public snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private teamService: TeamService) { }

  ngOnInit() {
    this.tabs = [
      {label: 'Giocatori', link: 'players'},
      {label: 'Ultima giornata', link: 'scores/last'},
      {label: 'Articoli', link: 'articles'},
    ]
    const id = parseInt(this.route.snapshot.params['team_id'], 10);
    console.log(id);
    this.teamService.getTeam(id).then(team => {
      this.team = team;
      this.selectedTeam.emit(team);
    });
  }
}
