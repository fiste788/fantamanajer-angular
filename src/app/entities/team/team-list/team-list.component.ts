import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'app/shared/shared.service';
import { Observable } from 'rxjs';
import { TeamService } from '../team.service';
import { Team } from '../team';
import { CardCreationAnimation } from 'app/shared/animations/card-creation.animation';

@Component({
  selector: 'fm-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  animations: [CardCreationAnimation]
})
export class TeamListComponent implements OnInit {
  teams: Observable<Team[]>;

  constructor(
    private teamService: TeamService,
    private shared: SharedService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.teams = this.teamService.getTeams(this.shared.getChampionshipId(this.route));
  }
}
