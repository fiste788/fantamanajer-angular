import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { Score } from '../score';
import { SharedService } from '../../shared/shared.service';
import { ScoreService } from '../score.service';
import { Matchday } from '../../matchday/matchday';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concatMap';

@Component({
  selector: 'fm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  scores: Map<string, Score>[];
  ranking: any[];
  // rankingDataSource: ExampleDataSource | null;
  rankingDataSource: RankingDataSource | null;
  scoresDataSource: ScoresDataSource | null;
  rankingDisplayedColumns = ['teamName', 'points'];
  scoresDisplayedColumns = [];
  matchdays: Matchday[];

  constructor(
    private scoreService: ScoreService,
    private shared: SharedService
  ) {
    this.matchdays = [];
    // this.rankingDataSource = new ExampleDataSource(this.exampleDatabase);
    // this.rankingDataSource = new RankingDataSource(this.scoreService);
    // this.scoresDataSource = new ScoresDataSource(this.scoreService);
  }

  ngOnInit(): void {
    this.scoreService.getRanking().subscribe(data => {
      this.ranking = data.ranking;
      // this.scores = data.scores;
      const firstKey = Object.keys(data.scores).shift();
      this.scores = Object.keys(data.scores).map(key => {
        const map = new Map<string, Score>();
        Object.keys(data.scores[key]).map(key2 => {
          const number: string = data.scores[key][key2].matchday.number + '';
          const value: Score = data.scores[key][key2] as Score;
          // return data.scores[key]['' + key2] as Score
          return map.set(number, value);
        });
        // .reverse();
        return map;
      });
      console.log(this.scores);
      Object.keys(data.scores[firstKey]).forEach(element => {
        const matchday: Matchday = data.scores[firstKey][element].matchday;
        this.matchdays.push(matchday);
        this.scoresDisplayedColumns.push('' + matchday.number);
      });
      this.matchdays.reverse();
      this.scoresDisplayedColumns.reverse();
      this.rankingDataSource = new RankingDataSource(this);
      this.scoresDataSource = new ScoresDataSource(this);
    });
  }
}

export class RankingDataSource extends DataSource<any> {
  constructor(private component: RankingComponent) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.of(this.component.ranking);
  }

  disconnect() {}
}

export class ScoresDataSource extends DataSource<any> {
  constructor(private component: RankingComponent) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.of(this.component.scores);
  }

  disconnect() {}
}
