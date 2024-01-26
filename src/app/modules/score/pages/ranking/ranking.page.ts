import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

import { addVisibleClassOnDestroy, filterNil, getRouteData } from '@app/functions';
import { ScoreService } from '@data/services';
import { Championship, RankingPosition } from '@data/types';
import { tableRowAnimation } from '@shared/animations';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./ranking.page.scss'],
  templateUrl: './ranking.page.html',
  standalone: true,
  imports: [NgIf, MatTableModule, RouterLink, NgFor, MatProgressSpinnerModule, AsyncPipe],
})
export class RankingPage {
  protected readonly ranking$: Observable<Array<RankingPosition>>;
  protected readonly rankingDisplayedColumns$: Observable<Array<string>>;
  protected readonly matchdays$: Observable<Array<number>>;
  private readonly rankingDisplayedColumns = ['team-name', 'points'];

  constructor(private readonly scoreService: ScoreService) {
    this.ranking$ = this.loadRanking();
    const matchdays$ = this.loadMatchdays();
    this.matchdays$ = matchdays$.pipe(map((ms) => ms.map((m) => +m)));
    this.rankingDisplayedColumns$ = matchdays$.pipe(
      map((c) => {
        c.unshift(...this.rankingDisplayedColumns);

        return c;
      }),
    );
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  protected loadRanking(): Observable<Array<RankingPosition>> {
    return getRouteData<Championship>('championship').pipe(
      switchMap((championship) => this.getRanking(championship)),
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

  protected getRanking(championship: Championship): Observable<Array<RankingPosition>> {
    return this.scoreService.getRanking(championship.id);
  }

  protected trackRanking(idx: number): number {
    return idx;
  }
}
