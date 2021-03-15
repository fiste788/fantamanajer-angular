import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { TeamService } from '@data/services';
import { UtilService } from '@app/services';
import { cardCreationAnimation } from '@shared/animations';
import { Championship, Team } from '@data/types';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./team-list.page.scss'],
  templateUrl: './team-list.page.html',
})
export class TeamListPage implements OnInit, OnDestroy {
  public teams$?: Observable<Array<Team>>;
  public exit = false;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly teamService: TeamService,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.loadData();
    this.attachEvents();
  }

  public loadData(): void {
    const id = UtilService.getSnapshotData<Championship>(this.route, 'championship')?.id;
    if (id) {
      this.teams$ = this.teamService.getTeams(id);
    }
  }

  public attachEvents(): void {
    this.subscriptions.add(
      this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationStart) {
          this.exit = true;
          this.teams$ = undefined;
        }
      }),
    );
  }

  public track(_: number, item: Team): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
