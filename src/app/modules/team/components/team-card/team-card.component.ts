import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';

import type { Team } from '@data/interfaces';
import { DetailToListTransitionDirective } from '@shared/directives';
import { SlugPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  selector: 'app-team-card',
  imports: [DetailToListTransitionDirective, MatButtonModule, MatCardModule, MatRippleModule, NgOptimizedImage, RouterLink, SlugPipe, SrcsetPipe],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {

  public readonly fetchpriority = input<'auto' | 'high' | 'low'>('auto');
  public readonly team = input.required<Team>();

  protected readonly imgRef = viewChild<string, ElementRef<HTMLImageElement>>('listImg', {
    read: ElementRef,
  });

}
