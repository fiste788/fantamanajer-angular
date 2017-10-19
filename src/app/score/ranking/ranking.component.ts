import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { Score } from '../score';
import { SharedService } from '../../shared/shared.service';
import { ScoreService } from '../score.service';
import { Matchday } from '../../matchday/matchday';
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/concatMap'

@Component({
  selector: 'fm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  scores: any[];
  ranking: any[];
  // rankingDataSource: ExampleDataSource | null;
  rankingDataSource: RankingDataSource | null;
  displayedColumns = ['teamName', 'points'];
  matchdays: Matchday[];

  constructor(
    private scoreService: ScoreService,
    private shared: SharedService) {
      this.matchdays = [];
      // this.rankingDataSource = new ExampleDataSource(this.exampleDatabase);
      this.rankingDataSource = new RankingDataSource(this.scoreService);
  }

  ngOnInit(): void {
    this.scoreService.getRanking()
      .then(data => {
        this.ranking = data.ranking;
        // this.scores = data.scores;
        const firstKey = Object.keys(data.scores).shift();
        this.scores = Object.keys(data.scores).map(
          key => Object.keys(data.scores[key]).map(
            key2 => data.scores[key][key2] as Score
          ).reverse()
        );
        Object.keys(data.scores[firstKey]).forEach(element => {
          this.matchdays.push(data.scores[firstKey][element].matchday);
        });
        this.matchdays.reverse()
      });
  }

}

export class RankingDataSource extends DataSource<any> {
  constructor(private scoreService: ScoreService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.fromPromise(this.scoreService.getRanking())
          .map(response => response.ranking)
          .concatMap(arr => Observable.from(arr))
          .toArray();
  }

  disconnect() {}
}
