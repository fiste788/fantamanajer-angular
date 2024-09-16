import { NgIf, AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, input, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';

import { filterNil, getRouteData } from '@app/functions';
import { ScoreService } from '@data/services';
import { Disposition, Lineup, Score, Team } from '@data/types';
import { DispositionListComponent } from '@modules/disposition/components/disposition-list/disposition-list.component';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  styleUrl: './score-detail.page.scss',
  templateUrl: './score-detail.page.html',
  standalone: true,
  imports: [
    NgIf,
    DispositionListComponent,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DecimalPipe,
  ],
})
export class ScoreDetailPage implements OnInit {
  readonly #route = inject(ActivatedRoute);
  readonly #scoreService = inject(ScoreService);

  protected id = input('');
  protected team$ = getRouteData<Team>('team');
  protected score$!: Observable<Score>;
  protected regular$!: Observable<Array<Disposition>>;
  protected notRegular$!: Observable<Array<Disposition>>;

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
    return this.#route.snapshot.url.pop()?.path === 'last'
      ? this.team$.pipe(switchMap((team) => this.#scoreService.getLastScore(team.id)))
      : this.#scoreService.getScore(+this.id);
  }
}
