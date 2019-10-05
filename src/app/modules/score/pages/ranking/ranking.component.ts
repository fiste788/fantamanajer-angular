import { Component, OnInit, HostBinding, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ScoreService } from '@app/core/services';
import { tableRowAnimation } from '@app/core/animations/table-row.animation';
import { Championship } from '@app/core/models';

@Component({
  selector: 'fm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  animations: [tableRowAnimation]
})
export class RankingComponent implements OnInit {
  @HostBinding('@tableRowAnimation') tableRowAnimation = '';

  dataSource: MatTableDataSource<any[]>;
  rankingDisplayedColumns = ['teamName', 'points'];
  matchdays: string[] = [];

  constructor(
    private scoreService: ScoreService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.route.parent.parent.parent.data.subscribe((data: { championship: Championship }) => {
      this.scoreService.getRanking(data.championship.id).subscribe((ranking: any[]) => {
        this.dataSource = new MatTableDataSource(ranking);
        if (ranking.length && ranking[0].scores) {
          this.matchdays = Object.keys(ranking[0].scores).reverse();
          this.rankingDisplayedColumns = this.rankingDisplayedColumns.concat(this.matchdays);
        }
        this.cd.detectChanges();
      });
    });
  }
}
