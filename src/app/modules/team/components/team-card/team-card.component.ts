import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';

import { Team } from '@data/types';
import { DetailToListTransitionDirective } from '@shared/directives';
import { SlugPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  selector: 'app-team-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    SrcsetPipe,
    NgOptimizedImage,
    MatRippleModule,
    SlugPipe,
    DetailToListTransitionDirective,
  ],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  public team = input.required<Team>();
  public fetchpriority = input<'auto' | 'high' | 'low'>('auto');
  protected imgRef = viewChild<string, ElementRef<HTMLImageElement>>('listImg', {
    read: ElementRef,
  });
}
