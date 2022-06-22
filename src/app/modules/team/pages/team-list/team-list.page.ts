import { Component } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { TeamService } from '@data/services';
import { Championship, Team } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./team-list.page.scss'],
  templateUrl: './team-list.page.html',
})
export class TeamListPage {
  protected readonly teams$?: Observable<Array<Team>>;

  constructor(private readonly teamService: TeamService) {
    this.teams$ = this.loadData();
  }

  protected loadData(): Observable<Array<Team>> {
    return getRouteData<Championship>('championship').pipe(
      switchMap((c) => this.teamService.getTeams(c.id)),
    );
  }

  protected track(_: number, item: Team): number {
    return item.id;
  }
}
