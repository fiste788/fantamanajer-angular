import { Component, OnInit } from '@angular/core';
import { Team } from '../team';
import { TeamService } from '../team.service';
import { Observable } from 'rxjs/Observable';
import { CardCreationAnimation } from 'app/shared/animations/card-creation.animation';
import { ApplicationService } from 'app/core/application.service';

@Component({
  selector: 'fm-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  animations: [CardCreationAnimation]
})
export class TeamListComponent implements OnInit {
  teams: Observable<Team[]>;

  constructor(private teamService: TeamService, private app: ApplicationService) { }

  ngOnInit(): void {
    this.teams = this.teamService.getTeams(this.app.championship.id);
  }
}
