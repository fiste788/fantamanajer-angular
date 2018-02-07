import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Score } from '../score';
import { SharedService } from 'app/shared/shared.service';
import { ScoreService } from '../score.service';
import { Matchday } from '../../matchday/matchday';
import { TableRowAnimation } from 'app/shared/animations/table-row.animation';

@Component({
  selector: 'fm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  animations: [TableRowAnimation]
})
export class RankingComponent implements OnInit {

  rankingDataSource: MatTableDataSource<any[]>;
  scoresDataSource: MatTableDataSource<Map<string, Score>>;
  rankingDisplayedColumns = ['teamName', 'points'];
  scoresDisplayedColumns = [];
  matchdays: Matchday[];

  constructor(
    private scoreService: ScoreService,
    private shared: SharedService
  ) {
    this.matchdays = [];
  }

  ngOnInit(): void {
    this.scoreService.getRanking().subscribe(data => {
      this.rankingDataSource = new MatTableDataSource(data.ranking);
      // this.scores = data.scores;
      const firstKey = Object.keys(data.scores).shift();
      const scores: Map<string, Score>[] = Object.keys(data.scores).map(key => {
        const map = new Map<string, Score>();
        Object.keys(data.scores[key]).map(key2 => {
          const number: string = data.scores[key][key2].matchday.number + '';
          const value: Score = data.scores[key][key2] as Score;
          // return data.scores[key]['' + key2] as Score
          return map.set(number, value);
        });
        return map;
      });
      Object.keys(data.scores[firstKey]).forEach(element => {
        const matchday: Matchday = data.scores[firstKey][element].matchday;
        this.matchdays.push(matchday);
        this.scoresDisplayedColumns.push('' + matchday.number);
      });
      this.matchdays.reverse();
      this.scoresDisplayedColumns.reverse();
      this.scoresDataSource = new MatTableDataSource(scores);
    });
  }
}
