import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

import { ScoreService } from '@app/http';
import { tableRowAnimation } from '@shared/animations/table-row.animation';
import { Championship, Matchday } from '@shared/models';

@Component({
  selector: 'fm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  animations: [tableRowAnimation]
})
export class RankingComponent implements OnInit {
  dataSource: MatTableDataSource<Array<any>>;
  rankingDisplayedColumns = ['teamName', 'points'];
  matchdays: Array<string> = [];

  constructor(
    private readonly scoreService: ScoreService,
    private readonly route: ActivatedRoute,
    private readonly cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.route.parent?.parent?.parent?.data.subscribe((data: { championship: Championship }) => {
      this.scoreService.getRanking(data.championship.id)
        .subscribe((ranking: Array<any>) => {
          this.dataSource = new MatTableDataSource(ranking);
          if (ranking.length && ranking[0].scores) {
            this.matchdays = Object.keys(ranking[0].scores)
              .reverse();
            this.rankingDisplayedColumns = this.rankingDisplayedColumns.concat(this.matchdays);
          }
          this.cd.detectChanges();
        });
    });
  }

  track(_: number, item: Matchday): number {
    return item.id;
  }
}
