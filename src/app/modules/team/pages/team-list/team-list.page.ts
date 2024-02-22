import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { addVisibleClassOnDestroy } from '@app/functions';
import { CurrentTransitionService } from '@app/services';
import { Team } from '@data/types';
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
  @Input({ required: true }) protected readonly teams?: Array<Team>;

  private readonly transitionService = inject(CurrentTransitionService);

  constructor() {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  protected track(_: number, item: Team): number {
    return item.id;
  }

  protected viewTransitionName(team: Team) {
    return this.transitionService.getViewTransitionName('banner-img', team, 'team_id');
  }
}
