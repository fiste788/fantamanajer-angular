import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';

import { addVisibleClassOnDestroy, filterNil, getRouteParam } from '@app/functions';
import { ScoreService } from '@data/services';
import { RankingPosition } from '@data/types';
import { tableRowAnimation } from '@shared/animations';

@Component({
  animations: [tableRowAnimation],
  styleUrl: './ranking.page.scss',
  templateUrl: './ranking.page.html',
  standalone: true,
  imports: [
    NgIf,
    MatTableModule,
    RouterLink,
    NgFor,
    MatProgressSpinnerModule,
    CdkScrollableModule,
    AsyncPipe,
    MatCardModule,
  ],
})
export class RankingPage {
  readonly #scoreService = inject(ScoreService);
  readonly #rankingDisplayedColumns = ['team-name', 'points'];

  protected readonly ranking$ = this.loadRanking();
  protected readonly rankingDisplayedColumns$: Observable<Array<string>>;
  protected readonly matchdays$: Observable<Array<number>>;

  constructor() {
    const matchdays$ = this.loadMatchdays();
    this.matchdays$ = matchdays$.pipe(map((ms) => ms.map((m) => +m)));
    this.rankingDisplayedColumns$ = matchdays$.pipe(
      map((c) => {
        c.unshift(...this.#rankingDisplayedColumns);

        return c;
      }),
    );
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  protected loadRanking(): Observable<Array<RankingPosition>> {
    return this.getRanking(+getRouteParam<string>('championship_id')!).pipe(
      shareReplay({ bufferSize: 0, refCount: true }),
    );
  }

  protected loadMatchdays(): Observable<Array<string>> {
    return this.ranking$.pipe(
      filter((ranking) => ranking.length > 0),
      map((ranking) => ranking[0]?.scores),
      filterNil(),
      map((scores) => Object.keys(scores).reverse()),
    );
  }

  protected getRanking(championshipId: number): Observable<Array<RankingPosition>> {
    return this.#scoreService.getRanking(championshipId);
  }

  protected trackRanking(idx: number): number {
    return idx;
  }
}
