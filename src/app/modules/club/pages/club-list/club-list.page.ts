import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { addVisibleClassOnDestroy } from '@app/functions';
import { CurrentTransitionService } from '@app/services';
import { Club } from '@data/types';
import { cardCreationAnimation } from '@shared/animations';
import { PlaceholderPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  animations: [],
  styleUrl: './club-list.page.scss',
  templateUrl: './club-list.page.html',
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
export class ClubListPage {
  @Input({ required: true }) protected clubs!: Array<Club>;

  private readonly transitionService = inject(CurrentTransitionService);

  constructor() {
    addVisibleClassOnDestroy(cardCreationAnimation);
  }

  protected viewTransitionName(club: Club) {
    return this.transitionService.getViewTransitionName('banner-img', club);
  }
}
