import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RankingPosition, ScoreService } from '@app/http';
import { UtilService } from '@app/services';
import { tableRowAnimation } from '@shared/animations/table-row.animation';
import { Championship, Matchday, Score, Team } from '@shared/models';

@Component({
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  animations: [tableRowAnimation]
})
export class RankingPage implements OnInit {
  ranking$: Observable<Array<RankingPosition>>;
  rankingDisplayedColumns = ['teamName', 'points'];
  matchdays: Array<string> = [];

  constructor(
    private readonly scoreService: ScoreService,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const championship = UtilService.getSnapshotData<Championship>(this.route, 'championship');
    if (championship) {
      this.ranking$ = this.loadRanking(championship);
    }
  }

  loadRanking(championship: Championship): Observable<Array<RankingPosition>> {
    return this.scoreService.getRanking(championship.id)
      .pipe(
        tap((ranking: Array<RankingPosition>) => {
          if (ranking.length && ranking[0].scores) {
            this.matchdays = Object.keys(ranking[0].scores)
              .reverse();
            this.rankingDisplayedColumns = this.rankingDisplayedColumns.concat(this.matchdays);
          }
        })
      );
  }

  track(_: number, item: Matchday): number {
    return item.id;
  }
}
