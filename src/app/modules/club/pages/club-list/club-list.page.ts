import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import type { Club } from '@data/interfaces';
import { DetailToListTransitionDirective } from '@shared/directives';
import { SlugPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  imports: [
    DetailToListTransitionDirective,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatRipple,
    NgOptimizedImage,
    RouterLink,
    SlugPipe,
    SrcsetPipe,
  ],
  templateUrl: './club-list.page.html',
  styleUrl: './club-list.page.scss',
})
export class ClubListPage {

  public readonly clubs = input.required<Club[]>();

  protected readonly imgRef = viewChild<string, ElementRef<HTMLImageElement>>('listImg', {
    read: ElementRef,
  });

}
