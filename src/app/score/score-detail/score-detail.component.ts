import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { ScoreService } from '../score.service';
import { Score } from '../score';
import { Disposition } from '../../disposition/disposition';
import { DispositionListComponent } from '../../disposition/disposition-list/disposition-list.component';

@Component({
  selector: 'fm-score-detail',
  templateUrl: './score-detail.component.html',
  styleUrls: ['./score-detail.component.scss']
})
export class ScoreDetailComponent implements OnInit {

  score: Score;
  regular: Disposition[];
  notRegular: Disposition[];

  constructor(
    private route: ActivatedRoute,
    private scoreService: ScoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.url.pop().path === 'last') {
      const team_id = this.getTeamId();
      this.scoreService.getLastScore(team_id).then(score => this.getData(score));
    } else {
      const id = parseInt(this.route.snapshot.params['id'], 10);
      this.scoreService.getScore(id).then(score => this.getData(score));
    }
  }

  getData(score: Score) {
    if (score != null) {
      const dispositions: Disposition[] = score.lineup.dispositions;
      this.regular = dispositions.splice(0, 11);
      this.notRegular = dispositions;
      this.score = score;
    }
  }

  getTeamId(): number {
    for (const x in this.route.snapshot.pathFromRoot) {
      if (this.route.pathFromRoot.hasOwnProperty(x)) {
        const current = this.route.snapshot.pathFromRoot[x];
        if (current.params.hasOwnProperty('team_id')) {
          return parseInt(current.params['team_id'], 10);
        }
      }
    }
  }

}
