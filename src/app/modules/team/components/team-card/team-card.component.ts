import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { CurrentTransitionService } from '@app/services';
import { Team } from '@data/types';
import { PlaceholderPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    PlaceholderPipe,
    SrcsetPipe,
    NgOptimizedImage,
  ],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  readonly #transitionService = inject(CurrentTransitionService);
  public team = input.required<Team>();

  protected viewTransitionName(team: Team) {
    return this.#transitionService.getViewTransitionName('banner-img', team, 'team_id');
  }
}
