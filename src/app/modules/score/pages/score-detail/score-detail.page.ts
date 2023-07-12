import { NgIf, AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';

import { filterNil, getRouteData } from '@app/functions';
import { ScoreService } from '@data/services';
import { Disposition, Lineup, Score, Team } from '@data/types';
import { DispositionListComponent } from '@modules/disposition/components/disposition-list/disposition-list.component';
import { MatEmptyStateComponent } from '@shared/components';

@Component({
  styleUrls: ['./score-detail.page.scss'],
  templateUrl: './score-detail.page.html',
  standalone: true,
  imports: [
    NgIf,
    DispositionListComponent,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
})
export class ScoreDetailPage implements OnInit {
  @Input() protected id = '';
  protected team$!: Observable<Team>;
  protected score$!: Observable<Score>;
  protected regular$!: Observable<Array<Disposition>>;
  protected notRegular$!: Observable<Array<Disposition>>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly scoreService: ScoreService,
  ) {
    this.team$ = getRouteData<Team>('team');
  }

  public ngOnInit(): void {
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
      ? this.team$.pipe(switchMap((team) => this.scoreService.getLastScore(team.id)))
      : this.scoreService.getScore(+this.id);
  }
}
