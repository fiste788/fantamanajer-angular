import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

import { filterNil, getRouteData } from '@app/functions';
import { ScoreService } from '@data/services';
import { Championship, RankingPosition } from '@data/types';
import { tableRowAnimation } from '@shared/animations';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./ranking.page.scss'],
  templateUrl: './ranking.page.html',
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
      map((ranking) => ranking[0].scores),
      filterNil(),
      map((scores) => Object.keys(scores).reverse()),
    );
  }

  protected getRanking(championship: Championship): Observable<Array<RankingPosition>> {
    return this.scoreService.getRanking(championship.id);
  }

  protected track(_: number, item: number): number {
    return item;
  }

  protected trackRanking(idx: number): number {
    return idx;
  }
}
