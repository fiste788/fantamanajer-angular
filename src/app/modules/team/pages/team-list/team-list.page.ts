import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { firstValueFrom, map, Observable } from 'rxjs';

import { TeamService } from '@data/services';
import { UtilService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { Championship, Team } from '@data/types';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./team-list.page.scss'],
  templateUrl: './team-list.page.html',
})
export class TeamListPage implements OnInit {
  public teams$?: Observable<Array<Team>>;
  public exit = false;

  constructor(
    private readonly router: Router,
    private readonly teamService: TeamService,
    private readonly route: ActivatedRoute,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.loadData();
    return this.attachEvents();
  }

  public loadData(): void {
    const id = UtilService.getSnapshotData<Championship>(this.route, 'championship')?.id;
    if (id) {
      this.teams$ = this.teamService.getTeams(id);
    }
  }

  public async attachEvents(): Promise<void> {
    return firstValueFrom(
      this.router.events.pipe(
        map((evt) => {
          if (evt instanceof NavigationStart) {
            this.exit = true;
            this.teams$ = undefined;
          }
        }),
      ),
    );
  }

  public track(_: number, item: Team): number {
    return item.id;
  }
}
