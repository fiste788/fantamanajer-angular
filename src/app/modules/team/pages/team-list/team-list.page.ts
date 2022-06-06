import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { firstValueFrom, map, Observable, switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { TeamService } from '@data/services';
import { Championship, Team } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./team-list.page.scss'],
  templateUrl: './team-list.page.html',
})
export class TeamListPage implements OnInit {
  public teams$?: Observable<Array<Team>>;
  public exit = false;

  constructor(private readonly router: Router, private readonly teamService: TeamService) {}

  public async ngOnInit(): Promise<void> {
    this.loadData();
    return this.attachEvents();
  }

  public loadData(): void {
    this.teams$ = getRouteData<Championship>('championship').pipe(
      switchMap((c) => this.teamService.getTeams(c.id)),
    );
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
      { defaultValue: undefined },
    );
  }

  public track(_: number, item: Team): number {
    return item.id;
  }
}
