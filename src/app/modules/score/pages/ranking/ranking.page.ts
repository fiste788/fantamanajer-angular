import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RankingPosition, ScoreService } from '@data/services';
import { UtilService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { Championship } from '@data/types';

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
  ) {
  }

  public ngOnInit(): void {
    const championship = UtilService.getSnapshotData<Championship>(this.route, 'championship');
    if (championship) {
      this.ranking$ = this.loadRanking(championship);
    }
  }

  public loadRanking(championship: Championship): Observable<Array<RankingPosition>> {
    return this.scoreService.getRanking(championship.id)
      .pipe(
        tap((ranking: Array<RankingPosition>) => {
          if (ranking.length && ranking[0].scores) {
            const matchdays = Object.keys(ranking[0].scores)
              .reverse();
            this.matchdays = matchdays.map(m => +m);
            this.rankingDisplayedColumns = this.rankingDisplayedColumns.concat(matchdays);
          }
        }),
      );
  }

  public track(_: number, item: number): number {
    return item;
  }
}
