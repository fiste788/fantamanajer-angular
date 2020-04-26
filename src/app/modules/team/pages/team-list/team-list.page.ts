import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { TeamService } from '@app/http';
import { UtilService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { Championship, Team } from '@shared/models';

@Component({
  templateUrl: './team-list.page.html',
  styleUrls: ['./team-list.page.scss'],
  animations: [cardCreationAnimation]
})
export class TeamListPage implements OnInit {
  teams$?: Observable<Array<Team>>;
  exit = false;

  constructor(
    private readonly router: Router,
    private readonly teamService: TeamService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.attachEvents();
  }

  loadData(): void {
    const id = UtilService.getSnapshotData<Championship>(this.route, 'championship')?.id;
    if (id) {
      this.teams$ = this.teamService.getTeams(id);
    }
  }

  attachEvents(): void {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        this.exit = true;
        this.teams$ = undefined;
      }
    });
  }

  track(_: number, item: Team): number {
    return item.id;
  }
}
