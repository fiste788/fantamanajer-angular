import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, linkedSignal, numberAttribute } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { map } from 'rxjs';

import type { Member } from '@data/interfaces';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { StickyDirective } from '@shared/directives';

const stats = ['sum_present', 'avg_points', 'avg_rating', 'sum_goals', 'sum_goals_against', 'sum_yellow_card', 'sum_red_card'] as const;
type Stats = (typeof stats)[number];

@Component({
  selector: 'app-member-list[members]',
  imports: [
    DecimalPipe,
    MatCardModule,
    MatCheckboxModule,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink,
    StickyDirective,
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListComponent {

  public readonly elevation = input(1, { transform: numberAttribute });
  public readonly hideClub = input(false, { transform: booleanAttribute });
  public readonly hideRole = input(false, { transform: booleanAttribute });
  public readonly isSelectable = input(false, { transform: booleanAttribute });
  public readonly members = input.required<Member[]>();
  public readonly multipleSelection = input(false, { transform: booleanAttribute });

  protected selection = new SelectionModel<Member>(this.multipleSelection(), [], true);

  public readonly selectionChange = outputFromObservable<Member[]>(this.selection.changed.pipe(map(() => this.selection.selected)));

  protected footer: Record<string, number> = {};

  protected readonly dataSource = linkedSignal(() => {
    const ds = new MatTableDataSource<Member>(this.members());
    if (ds.data.length > 0) {
      ds.sortingDataAccessor = this.sortingDataAccessor.bind(this);
      this.calcSummary(ds.data);
    }

    return ds;
  });

  readonly #columns = [
    'player',
    'role',
    'club',
    'sum_present',
    'avg_points',
    'avg_rating',
    'sum_goals',
    'sum_goals_against',
    'sum_assist',
    'sum_yellow_card',
    'sum_red_card',
  ];
  protected readonly displayedColumns = computed(() => this.fixColumns([...this.#columns]));

  protected calcSummary(data: Member[]): void {
    const statsRow = this.displayedColumns().filter((c): c is Stats => c.startsWith('sum') || c.startsWith('avg'));

    for (const column of statsRow) {
      this.footer[column] = 0;
      const rows = data.filter(row => row.stats && row.stats[column] > 0);
      for (const row of data) {
        if (row.stats) {
          this.footer[column] += row.stats[column];
        }
      }

      if (column.startsWith('avg')) {
        this.footer[column] /= rows.length;
      }
    }
  }

  protected fixColumns(columns: string[]): string[] {
    if (this.hideClub()) {
      columns.splice(columns.indexOf('club'), 1);
    }

    if (this.hideRole()) {
      columns.splice(columns.indexOf('role'), 1);
    }

    if (this.isSelectable()) {
      columns.unshift('select');
    }

    return columns;
  }

  protected sortingDataAccessor(data: Member, sortHeaderId: string): number | string {
    // eslint-disable-next-line unicorn/prefer-includes
    if (sortHeaderId === 'player' || stats.some(s => s === sortHeaderId)) {
      const id = sortHeaderId as 'player' | Stats;

      const value = id === 'player' ? data.player.full_name : (data.stats?.[id] ?? 0);
      if (typeof value === 'string' && !value.trim()) {
        return value;
      }

      return Number.isNaN(+value) ? value : +value;
    }

    return 0;
  }

  protected trackMember(_: number, item: Member): number {
    return item.id;
  }

}
