import { Component, OnInit } from '@angular/core';
import { Score } from '../score';
import { SharedService } from '../../shared/shared.service';
import { ScoreService } from '../score.service';
import { Matchday } from '../../matchday/matchday';

@Component({
  selector: 'fm-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  scores: any[];
  ranking: any[];
  matchdays: Matchday[];

  constructor(
    private scoreService: ScoreService,
    private shared: SharedService) {
      this.matchdays = [];
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
          )
        );
        Object.keys(data.scores[firstKey]).forEach(element => {
          this.matchdays.push(data.scores[firstKey][element].matchday);
        });
      });
  }

}
