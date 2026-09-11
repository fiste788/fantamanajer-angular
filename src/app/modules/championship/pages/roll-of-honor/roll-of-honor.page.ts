import type { KeyValue } from '@angular/common';
import { AsyncPipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

import { first, map, share } from 'rxjs';

import { filterNil, getRouteDataSignal, groupBy } from '@app/functions';
import type { Championship, RollOfHonor } from '@data/interfaces';
import { LeagueService } from '@data/services';

@Component({
  selector: 'app-roll-of-honor',
  imports: [AsyncPipe, DecimalPipe, KeyValuePipe, MatCardModule, MatProgressSpinnerModule, MatTableModule, RouterModule],
  templateUrl: './roll-of-honor.page.html',
  styleUrl: './roll-of-honor.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RollOfHonorPage {

  readonly #leagueService = inject(LeagueService);

  protected displayedColumns = ['season', 'first', 'second', 'thirth'];
  protected displayedColumnsByUser = ['user', 'victory'];

  readonly #championship = getRouteDataSignal<Championship>('championship');

  protected readonly dataSource$ = this.#leagueService.getRollOfHonor(this.#championship().league_id).pipe(first(null, undefined), share());
  protected readonly dataSourceByUser$ = this.dataSource$.pipe(
    filterNil(),
    map((result) => {
      const group = groupBy(result, item => `${item.roll_of_honor_entries[0]!.team.user.name} ${item.roll_of_honor_entries[0]!.team.user.surname}`);

      return new Map([...group].map(entry => [entry[0], entry[1].map(championship => championship.season.name)]));
    }),
  );

  protected trackRollOfHonor(_: number, item: Championship & RollOfHonor): number {
    return item.season_id;
  }

  protected victoryOrder = (a: KeyValue<string, unknown[]>, b: KeyValue<string, unknown[]>): number => b.value.length - a.value.length;

}
