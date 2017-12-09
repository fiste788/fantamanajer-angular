import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../shared/shared.service';
import { ScoreService } from '../score.service';
import { Score } from '../score';
import { Disposition } from '../../disposition/disposition';
import { DispositionListComponent } from '../../disposition/disposition-list/disposition-list.component';
import { share } from 'rxjs/operators';

@Component({
  selector: 'fm-score-detail',
  templateUrl: './score-detail.component.html',
  styleUrls: ['./score-detail.component.scss'],
})
export class ScoreDetailComponent implements OnInit {
  score: Observable<Score>;
  regular: Disposition[];
  notRegular: Disposition[];

  constructor(
    private route: ActivatedRoute,
    private scoreService: ScoreService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.url.pop().path === 'last') {
      const team_id = this.getTeamId();
      this.score = this.scoreService.getLastScore(team_id).pipe(share());
    } else {
      const id = parseInt(this.route.snapshot.params['id'], 10);
      this.score = this.scoreService.getScore(id).pipe(share());
    }
    this.score.subscribe(score => this.getData(score));
  }

  getData(score: Score) {
    if (score != null) {
      const dispositions: Disposition[] = score.lineup.dispositions;
      this.regular = dispositions.splice(0, 11);
      this.notRegular = dispositions;
      // this.score = score;
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
