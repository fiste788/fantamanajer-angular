import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { CurrentTransitionService } from '@app/services';
import { Team } from '@data/types';
import { PlaceholderPipe, SrcsetPipe } from '@shared/pipes';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    LazyLoadImageModule,
    MatButtonModule,
    RouterLink,
    PlaceholderPipe,
    SrcsetPipe,
  ],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  public team = input.required<Team>();
  private readonly transitionService = inject(CurrentTransitionService);

  protected viewTransitionName(team: Team) {
    return this.transitionService.getViewTransitionName('banner-img', team, 'team_id');
  }
}
