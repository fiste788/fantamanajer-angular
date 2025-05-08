import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Club } from '@data/types';
import { SlugPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  animations: [],
  styleUrl: './club-list.page.scss',
  templateUrl: './club-list.page.html',
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    SrcsetPipe,
    NgOptimizedImage,
    MatRipple,
    SlugPipe,
  ],
})
export class ClubListPage {
  readonly #transitionService = inject(CurrentTransitionService);

  protected clubs = input.required<Array<Club>>();
  protected img = viewChild<string, ElementRef<HTMLImageElement>>('listImg', {
    read: ElementRef,
  });

  protected viewTransitionName(club: Club, transition_name = 'banner-img'): string {
    return this.#transitionService.isDetailToList(club) ? transition_name : '';
  }
}
