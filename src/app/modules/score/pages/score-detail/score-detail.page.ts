import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ScoreService } from '@data/services';
import { UtilService } from '@app/services';
import { Disposition, Score, Team } from '@data/types';

@Component({
  styleUrls: ['./score-detail.page.scss'],
  templateUrl: './score-detail.page.html',
})
export class ScoreDetailPage implements OnInit {
  public score$: Observable<Score>;
  public regular: Array<Disposition> = [];
  public notRegular: Array<Disposition> = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly scoreService: ScoreService,
  ) {}

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    const teamId = UtilService.getSnapshotData<Team>(this.route, 'team')?.id;
    if (this.route.snapshot.url.pop()?.path === 'last' && teamId) {
      this.score$ = this.scoreService.getLastScore(teamId);
    } else {
      const id = +this.route.snapshot.params.id;
      this.score$ = this.scoreService.getScore(id);
    }
    this.score$ = this.score$.pipe(
      tap((score) => {
        this.getData(score);
      }),
    );
  }

  public getData(score?: Score): void {
    if (score !== undefined && score.lineup !== undefined) {
      const dispositions = score.lineup.dispositions;
      this.regular = dispositions.splice(0, 11);
      this.notRegular = dispositions;
    }
  }
}
