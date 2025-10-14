import { DecimalPipe } from '@angular/common';
import { Component, input, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { getRouteData } from '@app/functions';
import { ScoreService } from '@data/services';
import { Score, Team } from '@data/types';
import { DispositionListComponent } from '@modules/disposition/components/disposition-list/disposition-list.component';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  styleUrl: './score-detail.page.scss',
  templateUrl: './score-detail.page.html',
  imports: [
    DispositionListComponent,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    DecimalPipe,
  ],
})
export class ScoreDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #scoreService = inject(ScoreService);

  protected id = input('');
  protected team$ = getRouteData<Team>('team');
  protected score = toSignal(this.getScore());
  protected regular = computed(() => this.score()?.lineup?.dispositions.slice(0, 11));
  protected notRegular = computed(() => this.score()?.lineup?.dispositions.slice(11));

  protected getScore(): Observable<Score> {
    return this.#route.snapshot.url.pop()?.path === 'last'
      ? this.team$.pipe(switchMap((team) => this.#scoreService.getLastTeamScore(team.id)))
      : this.#scoreService.getScoreById(+this.id());
  }
}
