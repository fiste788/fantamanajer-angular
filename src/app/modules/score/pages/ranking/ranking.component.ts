import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ScoreService } from '@app/http';
import { UtilService } from '@app/services';
import { tableRowAnimation } from '@shared/animations/table-row.animation';
import { Championship, Matchday, Score, Team } from '@shared/models';

interface Position {
  team_id: number;
  team: Team;
  scores: Array<Score>;
  sum_points: number;
}

@Component({
  selector: 'fm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  animations: [tableRowAnimation]
})
export class RankingComponent implements OnInit {
  ranking$: Observable<Array<Position>>;
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

  loadRanking(championship: Championship): Observable<any> {
    return this.scoreService.getRanking(championship.id)
      .pipe(
        tap(ranking => {
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
