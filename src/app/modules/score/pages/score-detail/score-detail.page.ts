import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';

import { getRouteData } from '@app/functions';
import { ScoreService } from '@data/services';
import { Score, Team } from '@data/types';
import { DispositionListComponent } from '@modules/disposition/components/disposition-list/disposition-list.component';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { Observable, switchMap } from 'rxjs';

@Component({
  imports: [DecimalPipe, DispositionListComponent, MatEmptyStateComponent, MatProgressSpinnerModule],
  templateUrl: './score-detail.page.html',
  styleUrl: './score-detail.page.scss',
})
export class ScoreDetailPage {

  readonly #route = inject(ActivatedRoute);
  readonly #scoreService = inject(ScoreService);

  public readonly id = input('');

  protected team$ = getRouteData<Team>('team');

  protected readonly score = toSignal(this.getScore());
  protected readonly notRegular = computed(() => this.score()?.lineup?.dispositions.slice(11));
  protected readonly regular = computed(() => this.score()?.lineup?.dispositions.slice(0, 11));

  protected getScore(): Observable<Score> {
    return this.#route.snapshot.url.pop()?.path === 'last'
      ? this.team$.pipe(switchMap(team => this.#scoreService.getLastTeamScore(team.id)))
      : this.#scoreService.getScoreById(+this.id());
  }

}
