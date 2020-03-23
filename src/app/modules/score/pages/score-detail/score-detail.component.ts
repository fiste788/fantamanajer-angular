import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ScoreService } from '@app/http';
import { UtilService } from '@app/services';
import { Disposition, Score, Team } from '@shared/models';

@Component({
  selector: 'fm-score-detail',
  templateUrl: './score-detail.component.html',
  styleUrls: ['./score-detail.component.scss']
})
export class ScoreDetailComponent implements OnInit {
  score$: Observable<Score>;
  regular: Array<Disposition>;
  notRegular: Array<Disposition>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly scoreService: ScoreService
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.url.pop()?.path === 'last') {
      const teamId = UtilService.getSnapshotData<Team>(this.route, 'team')?.id;
      if (teamId) {
        this.score$ = this.scoreService.getLastScore(teamId)
          .pipe(
            map(score => this.getData(score))
          );
      }
    } else {
      const id = parseInt(this.route.snapshot.params.id, 10);
      this.score$ = this.scoreService.getScore(id)
        .pipe(
          map(score => this.getData(score))
        );
    }
  }

  getData(score: Score): Score {
    if (score !== undefined && score.lineup !== undefined) {
      const dispositions: Array<Disposition> = score.lineup.dispositions;
      this.regular = dispositions.splice(0, 11);
      this.notRegular = dispositions;
    }

    return score;
  }
}
