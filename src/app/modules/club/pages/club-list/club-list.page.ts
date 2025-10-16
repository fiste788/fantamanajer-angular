import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { Club } from '@data/types';
import { DetailToListTransitionDirective } from '@shared/directives';
import { SlugPipe, SrcsetPipe } from '@shared/pipes';

@Component({
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
    DetailToListTransitionDirective,
  ],
})
export class ClubListPage {
  protected clubs = input.required<Array<Club>>();
  protected imgRef = viewChild<string, ElementRef<HTMLImageElement>>('listImg', {
    read: ElementRef,
  });
}
