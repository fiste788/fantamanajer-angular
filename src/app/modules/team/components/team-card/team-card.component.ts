import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Team } from '@data/types';
import { PlaceholderPipe, SlugPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  selector: 'app-team-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    PlaceholderPipe,
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

  protected viewTransitionName(team: Team) {
    return this.#transitionService.getViewTransitionName('banner-img', team, 'team_id');
  }
}
