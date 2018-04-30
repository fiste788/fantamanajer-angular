import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { SharedService } from 'app/shared/shared.service';
import { ScoreService } from '../score.service';
import { Score } from '../score';
import { Matchday } from '../../matchday/matchday';
import { TableRowAnimation } from 'app/shared/animations/table-row.animation';

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
    private shared: SharedService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.scoreService.getRanking(this.shared.getChampionshipId(this.route)).subscribe((ranking: any[]) => {
      this.dataSource = new MatTableDataSource(ranking);
      if (ranking.length) {
        this.matchdays = Object.keys(ranking[0].scores).reverse();
      }
    });
  }
}
