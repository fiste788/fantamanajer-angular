import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Observable, switchMap } from 'rxjs';

import { addVisibleClassOnDestroy, getRouteData } from '@app/functions';
import { TeamService } from '@data/services';
import { Championship, Team } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';
import { PlaceholderPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  animations: [cardCreationAnimation],
  styleUrls: ['./team-list.page.scss'],
  templateUrl: './team-list.page.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    LazyLoadImageModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    AsyncPipe,
    PlaceholderPipe,
    SrcsetPipe,
  ],
})
export class TeamListPage {
  protected readonly teams$?: Observable<Array<Team>>;

  constructor(private readonly teamService: TeamService) {
    this.teams$ = this.loadData();
    addVisibleClassOnDestroy(cardCreationAnimation);
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
