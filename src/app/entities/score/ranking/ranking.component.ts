import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '../../../shared/shared.service';
import { ScoreService } from '../score.service';
import { TableRowAnimation } from '../../../shared/animations/table-row.animation';
import { Championship } from '../../championship/championship';

@Component({
  selector: 'fm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  animations: [TableRowAnimation]
})
export class RankingComponent implements OnInit {
  @HostBinding('@tableRowAnimation') tableRowAnimation = '';

  dataSource: MatTableDataSource<any[]>;
  rankingDisplayedColumns = ['teamName', 'points'];
  matchdays = [];

  constructor(
    private scoreService: ScoreService,
    private shared: SharedService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.parent.parent.parent.data.subscribe((data: { championship: Championship }) => {
      this.scoreService.getRanking(data.championship.id).subscribe((ranking: any[]) => {
        this.dataSource = new MatTableDataSource(ranking);
        if (ranking.length && ranking[0].scores) {
          this.matchdays = Object.keys(ranking[0].scores).reverse();
          this.matchdays.map((matchday: string) => this.rankingDisplayedColumns.push(matchday));
        }
      });
    });
  }
}
