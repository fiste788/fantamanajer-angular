import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { ScoreService } from '@data/services';
import { UtilService } from '@app/services';
import { Disposition, Score, Team } from '@data/types';

@Component({
  styleUrls: ['./score-detail.page.scss'],
  templateUrl: './score-detail.page.html',
})
export class ScoreDetailPage {
  public score$: Observable<Score>;
  public regular: Array<Disposition> = [];
  public notRegular: Array<Disposition> = [];

  constructor(private readonly route: ActivatedRoute, private readonly scoreService: ScoreService) {
    this.score$ = this.getScore().pipe(
      tap((score) => {
        if (score?.lineup) {
          const dispositions = score.lineup.dispositions;
          this.regular = dispositions.splice(0, 11);
          this.notRegular = dispositions;
        }
      }),
    );
  }

  getScore() {
    return this.route.snapshot.url.pop()?.path === 'last'
      ? UtilService.getData<Team>(this.route, 'team').pipe(
          switchMap((team) => this.scoreService.getLastScore(team.id)),
        )
      : this.scoreService.getScore(+this.route.snapshot.params.id);
  }
}
