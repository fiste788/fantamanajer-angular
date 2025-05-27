/* eslint-disable unicorn/no-null */
import { AsyncPipe, DecimalPipe, KeyValue, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { first, map, share } from 'rxjs';

import { filterNil, getRouteDataSignal, groupBy } from '@app/functions';
import { LeagueService } from '@data/services';
import { Championship, RollOfHonor } from '@data/types';

@Component({
  selector: 'app-roll-of-honor',
  imports: [
    AsyncPipe,
    DecimalPipe,
    KeyValuePipe,
    MatCardModule,
    RouterModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './roll-of-honor.page.html',
  styleUrl: './roll-of-honor.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RollOfHonorPage {
  protected displayedColumns = ['season', 'first', 'second', 'thirth'];
  protected displayedColumnsByUser = ['user', 'victory'];

  readonly #leagueService = inject(LeagueService);
  readonly #championship = getRouteDataSignal<Championship>('championship');

  protected readonly dataSource$ = this.#leagueService
    .getRollOfHonor(this.#championship().league_id)
    .pipe(first(null, undefined), share());

  protected readonly dataSourceByUser$ = this.dataSource$.pipe(
    filterNil(),
    map((res) => {
      const group = groupBy(
        res,
        (item) =>
          `${item.roll_of_honor[0]!.team.user.name} ${item.roll_of_honor[0]!.team.user.surname}`,
      );

      return new Map(
        [...group.entries()].map((e) => [
          e[0],
          e[1].map((championship) => championship.season.name),
        ]),
      );
    }),
  );

  protected victoryOrder = (
    a: KeyValue<string, Array<unknown>>,
    b: KeyValue<string, Array<unknown>>,
  ): number => {
    return b.value.length - a.value.length;
  };

  protected trackRollOfHonor(_: number, item: Championship & RollOfHonor): number {
    return item.season_id;
  }
}
