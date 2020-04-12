import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
    this.loadData();
  }

  loadData(): void {
    const teamId = UtilService.getSnapshotData<Team>(this.route, 'team')?.id;
    if (this.route.snapshot.url.pop()?.path === 'last' && teamId) {
      this.score$ = this.scoreService.getLastScore(teamId);
    } else {
      const id = +this.route.snapshot.params.id;
      this.score$ = this.scoreService.getScore(id);
    }
    this.score$.pipe(
      tap(score => {
        this.getData(score);
      })
    );
  }

  getData(score: Score): void {
    if (score !== undefined && score.lineup !== undefined) {
      const dispositions: Array<Disposition> = score.lineup.dispositions;
      this.regular = dispositions.splice(0, 11);
      this.notRegular = dispositions;
    }
  }
}
