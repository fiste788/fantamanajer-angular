import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';

import { getRouteData } from '@app/functions';
import { ScoreService } from '@data/services';
import { Team } from '@data/types';
import { DispositionListComponent } from '@modules/disposition/components/disposition-list/disposition-list.component';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { switchMap } from 'rxjs';

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

  // Converti l'input in Observable per reagire quando il valore viene iniettato
  protected readonly score = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => {
        const isLast = this.#route.snapshot.url.at(-1)?.path === 'last';
        return isLast ? this.team$.pipe(switchMap((team) => this.#scoreService.getLastTeamScore(team.id))) : this.#scoreService.getScoreById(+id);
      }),
    ),
  );

  protected readonly notRegular = computed(() => this.score()?.lineup?.dispositions.slice(11));
  protected readonly regular = computed(() => this.score()?.lineup?.dispositions.slice(0, 11));
}
