import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs/Observable';
import { Score } from '../score';
import { ScoreService } from '../score.service';
import { Matchday } from '../../matchday/matchday';
import { TableRowAnimation } from 'app/shared/animations/table-row.animation';
import { ApplicationService } from 'app/core/application.service';

@Component({
  selector: 'fm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  animations: [TableRowAnimation]
})
export class RankingComponent implements OnInit {

  dataSource: MatTableDataSource<any[]>;
  rankingDisplayedColumns = ['teamName', 'points'];
  matchdays = [];

  constructor(
    private scoreService: ScoreService,
    private app: ApplicationService
  ) {
  }

  ngOnInit(): void {
    this.scoreService.getRanking(this.app.championship.id).subscribe((ranking: any[]) => {
      this.dataSource = new MatTableDataSource(ranking);
      if (ranking.length) {
        this.matchdays = Object.keys(ranking[0].scores).reverse();
      }
    });
  }
}
