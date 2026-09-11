import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { filter, map, shareReplay } from 'rxjs';
import type { Observable } from 'rxjs';

import { filterNil, getRouteParam } from '@app/functions';
import type { RankingPosition } from '@data/interfaces';
import { ScoreService } from '@data/services';

@Component({
  imports: [AsyncPipe, CdkScrollableModule, DecimalPipe, MatCardModule, MatProgressSpinnerModule, MatTableModule, RouterLink],
  templateUrl: './ranking.page.html',
  styleUrl: './ranking.page.scss',
})
export class RankingPage {

  readonly #scoreService = inject(ScoreService);

  protected readonly matchdays$: Observable<number[]>;
  protected readonly ranking$ = this.loadRanking();
  protected readonly rankingDisplayedColumns$: Observable<string[]>;

  readonly #rankingDisplayedColumns = ['team-name', 'points'];

  constructor() {
    const matchdays$ = this.loadMatchdays();
    this.matchdays$ = matchdays$.pipe(map(ms => ms.map(m => +m)));
    this.rankingDisplayedColumns$ = matchdays$.pipe(
      map((c) => {
        c.unshift(...this.#rankingDisplayedColumns);

        return c;
      }),
    );
  }

  protected getRanking(championshipId: number): Observable<RankingPosition[]> {
    return this.#scoreService.getChampionshipRanking(championshipId);
  }

  protected loadMatchdays(): Observable<string[]> {
    return this.ranking$.pipe(
      filter(ranking => ranking.length > 0),
      map(ranking => ranking[0]?.scores),
      filterNil(),
      // eslint-disable-next-line unicorn/no-array-reverse
      map(scores => Object.keys(scores).reverse()),
    );
  }

  protected loadRanking(): Observable<RankingPosition[]> {
    return this.getRanking(+getRouteParam<string>('championship_id')!).pipe(shareReplay({ bufferSize: 0, refCount: true }));
  }

  protected trackRanking(index: number): number {
    return index;
  }

}
