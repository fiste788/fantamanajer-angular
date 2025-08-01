import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Team } from '@data/types';
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
  ],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  readonly #transitionService = inject(CurrentTransitionService);
  public team = input.required<Team>();
  public priority = input(false);
  protected imgRef = viewChild<string, ElementRef<HTMLImageElement>>('listImg', {
    read: ElementRef,
  });

  protected viewTransitionName(team: Team, transition_name = 'banner-img'): string {
    return this.#transitionService.isDetailToList(team, 'team_id') ? transition_name : '';
  }
}
