import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';

import { filterNil, getRouteData } from '@app/functions';
import { ScoreService } from '@data/services';
import { Disposition, Lineup, Score, Team } from '@data/types';

@Component({
  styleUrls: ['./score-detail.page.scss'],
  templateUrl: './score-detail.page.html',
})
export class ScoreDetailPage {
  protected readonly score$: Observable<Score>;
  protected readonly regular$: Observable<Array<Disposition>>;
  protected readonly notRegular$: Observable<Array<Disposition>>;

  constructor(private readonly route: ActivatedRoute, private readonly scoreService: ScoreService) {
    this.score$ = this.getScore().pipe(shareReplay({ bufferSize: 0, refCount: true }));
    const lineup$: Observable<Lineup> = this.score$.pipe(
      map((score) => score.lineup),
      filterNil(),
    );
    this.regular$ = lineup$.pipe(map((lineup) => lineup.dispositions.slice(0, 11)));
    this.notRegular$ = lineup$.pipe(map((lineup) => lineup.dispositions.slice(11)));
  }

  protected getScore(): Observable<Score> {
    return this.route.snapshot.url.pop()?.path === 'last'
      ? getRouteData<Team>('team').pipe(
          switchMap((team) => this.scoreService.getLastScore(team.id)),
        )
      : this.scoreService.getScore(+this.route.snapshot.params['id']);
  }
}
