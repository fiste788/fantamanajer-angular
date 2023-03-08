import { SelectionModel } from '@angular/cdk/collections';
import { NgIf, NgClass, AsyncPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

import { Member } from '@data/types';
import { tableRowAnimation } from '@shared/animations';

import { MatEmptyStateComponent } from '../../../../shared/components/mat-empty-state/mat-empty-state.component';
import { StickyDirective } from '../../../../shared/directives/sticky.directive';

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
  styleUrls: ['./member-list.component.scss'],
  templateUrl: './member-list.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    MatTableModule,
    MatSortModule,
    StickyDirective,
    MatCheckboxModule,
    RouterLink,
    MatTooltipModule,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DecimalPipe,
  ],
})
export class MemberListComponent implements OnInit {
  @Input() public members!: Observable<Array<Member>>;
  @Input() public hideClub = false;
  @Input() public isSelectable = false;
  @Input() public multipleSelection = false;
  @Input() public elevation = 1;

  @Output() public readonly selection: SelectionModel<Member>;

  @ViewChild(MatSort, { static: false }) protected sort?: MatSort;
  @ViewChild(MatTable, { static: true }) protected table?: MatTable<Member>;

  protected dataSource$?: Observable<MatTableDataSource<Member>>;
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

  constructor(private readonly changeRef: ChangeDetectorRef) {
    this.selection = new SelectionModel<Member>(this.multipleSelection, [], true);
  }

  public ngOnInit(): void {
    this.fixColumns();
    this.dataSource$ = this.dataSourceFromMembers();
  }

  protected setSort(ds: MatTableDataSource<Member>): void {
    if (this.sort) {
      ds.sort = this.sort;
    }
  }

  protected fixColumns(): void {
    if (this.hideClub) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('club'), 1);
    }
    if (this.isSelectable) {
      this.displayedColumns.unshift('select');
    }
  }

  protected dataSourceFromMembers(): Observable<MatTableDataSource<Member>> {
    return this.members.pipe(
      map((data) => new MatTableDataSource<Member>(data)),
      tap((ds) => {
        if (ds.data.length > 0) {
          ds.sortingDataAccessor = this.sortingDataAccessor.bind(this);
          this.calcSummary(ds.data);
        }
        this.changeRef.detectChanges();
      }),
    );
  }

  protected calcSummary(data: Array<Member>): void {
    const statsRow = this.displayedColumns.filter(
      (c): c is Stats => c.startsWith('sum') || c.startsWith('avg'),
    );
    for (const column of statsRow) {
      this.footer[column] = 0;
      const rows = data.filter((row) => row.stats && row.stats[column] > 0);
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

  protected sortingDataAccessor(data: Member, sortHeaderId: string): string | number {
    // eslint-disable-next-line unicorn/prefer-includes
    if (sortHeaderId === 'player' || stats.some((s) => s === sortHeaderId)) {
      let value;
      const id = sortHeaderId as Stats | 'player';
      switch (id) {
        case 'player': {
          value = data.player.full_name;
          break;
        }
        default: {
          value = data.stats ? data.stats[id] : 0;
          break;
        }
      }
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
