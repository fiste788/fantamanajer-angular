import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  booleanAttribute,
  input,
  numberAttribute,
  linkedSignal,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { addVisibleClassOnDestroy } from '@app/functions';
import { Member } from '@data/types';
import { tableRowAnimation } from '@shared/animations';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { StickyDirective } from '@shared/directives';

const stats = [
  'sum_present',
  'avg_points',
  'avg_rating',
  'sum_goals',
  'sum_goals_against',
  'sum_yellow_card',
  'sum_red_card',
] as const;
type Stats = (typeof stats)[number];

@Component({
  animations: [tableRowAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-list[members]',
  styleUrl: './member-list.component.scss',
  templateUrl: './member-list.component.html',
  imports: [
    MatTableModule,
    MatSortModule,
    StickyDirective,
    MatCheckboxModule,
    RouterLink,
    MatTooltipModule,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    DecimalPipe,
    MatCardModule,
  ],
})
export class MemberListComponent implements OnInit {
  public members = input.required<Array<Member>>();
  public hideClub = input(false, { transform: booleanAttribute });
  public hideRole = input(false, { transform: booleanAttribute });
  public isSelectable = input(false, { transform: booleanAttribute });
  public multipleSelection = input(false, { transform: booleanAttribute });
  public elevation = input(1, { transform: numberAttribute });

  protected selection = new SelectionModel<Member>(this.multipleSelection(), [], true);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly selectionChange = outputFromObservable<Array<Member>>(
    this.selection.changed.pipe(map(() => this.selection.selected)),
  );

  protected dataSource = linkedSignal(() => {
    const ds = new MatTableDataSource<Member>(this.members());
    if (ds.data.length > 0) {
      ds.sortingDataAccessor = this.sortingDataAccessor.bind(this);
      this.calcSummary(ds.data);
    }

    return ds;
  });

  protected displayedColumns = [
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

  protected footer: Record<string, number> = {};

  constructor() {
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  public ngOnInit(): void {
    this.fixColumns();
  }

  protected fixColumns(): void {
    if (this.hideClub()) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('club'), 1);
    }
    if (this.hideRole()) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('role'), 1);
    }
    if (this.isSelectable()) {
      this.displayedColumns.unshift('select');
    }
  }

  protected calcSummary(data: Array<Member>): void {
    const statsRow = this.displayedColumns.filter(
      (c): c is Stats => c.startsWith('sum') || c.startsWith('avg'),
    );
    for (const column of statsRow) {
      this.footer[column] = 0;
      const rows = data.filter((row) => row.stats !== undefined && row.stats[column] > 0);
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

  protected sortingDataAccessor(data: Member, sortHeaderId: string): number | string {
    // eslint-disable-next-line unicorn/prefer-includes
    if (sortHeaderId === 'player' || stats.some((s) => s === sortHeaderId)) {
      const id = sortHeaderId as Stats | 'player';

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
