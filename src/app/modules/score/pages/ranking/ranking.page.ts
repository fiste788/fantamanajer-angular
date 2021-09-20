import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ScoreService } from '@data/services';
import { UtilService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { Championship, RankingPosition } from '@data/types';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./ranking.page.scss'],
  templateUrl: './ranking.page.html',
})
export class RankingPage implements OnInit {
  public ranking$: Observable<Array<RankingPosition>>;
  public rankingDisplayedColumns = ['teamName', 'points'];
  public matchdays: Array<number> = [];

  constructor(
    private readonly scoreService: ScoreService,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.ranking$ = UtilService.getData<Championship>(this.route, 'championship').pipe(
      switchMap((championship) => this.loadRanking(championship)),
    );
  }

  public loadRanking(championship: Championship): Observable<Array<RankingPosition>> {
    return this.scoreService.getRanking(championship.id).pipe(
      tap((ranking: Array<RankingPosition>) => {
        if (ranking.length && ranking[0].scores) {
          const matchdays = Object.keys(ranking[0].scores).reverse();
          this.matchdays = matchdays.map((m) => +m);
          this.rankingDisplayedColumns = this.rankingDisplayedColumns.concat(matchdays);
        }
      }),
    );
  }

  public track(_: number, item: number): number {
    return item;
  }
}
