import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';

import { tableRowAnimation } from '@shared/animations';
import { Member } from '@data/types';

const stats = ['sum_present', 'avg_points', 'avg_rating', 'sum_goals', 'sum_goals_against', 'sum_yellow_card', 'sum_red_card'] as const;
type Stats = typeof stats[number];

@Component({
  animations: [tableRowAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-list',
  styleUrls: ['./member-list.component.scss'],
  templateUrl: './member-list.component.html',
})
export class MemberListComponent implements OnInit, OnDestroy {
  @Input() public members: Observable<Array<Member>>;
  @Input() public hideClub = false;
  @Input() public isSelectable = false;
  @Input() public multipleSelection = false;
  @Input() public elevation = 1;

  @Output() public readonly selection = new SelectionModel<Member>(this.multipleSelection, [], true);

  @ViewChild(MatSort) public sort: MatSort;

  public dataSource?: MatTableDataSource<Member>;
  public displayedColumns = [
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
  public footer: { [column: string]: number } = {};
  private subscription: Subscription;

  constructor(private readonly changeRef: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.fixColumns();
    this.loadMembers();
  }

  public fixColumns(): void {
    if (this.hideClub) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('club'), 1);
    }
    if (this.isSelectable) {
      this.displayedColumns.unshift('select');
    }
  }

  public loadMembers(): void {
    this.subscription = this.members.subscribe((data) => {
      this.dataSource = new MatTableDataSource<Member>(data);
      if (data.length) {
        this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
        this.calcSummary(data);
        this.changeRef.detectChanges();
        this.dataSource.sort = this.sort;
      } else {
        this.changeRef.detectChanges();
      }
    });
  }

  public calcSummary(data: Array<Member>): void {
    this.displayedColumns.filter((c): c is Stats => c.startsWith('sum') || c.startsWith('avg'))
      .forEach((column) => {
        this.footer[column] = 0;
        const rows = data.filter(row => row.stats && row.stats[column] > 0);
        data.forEach((row) => {
          if (row.stats) {
            this.footer[column] += row.stats[column];
          }
        });
        if (column.startsWith('avg')) {
          this.footer[column] /= rows.length;
        }
      });

  }

  public sortingDataAccessor(data: Member, sortHeaderId: string): string | number {
    if (sortHeaderId === 'player' || stats.find(s => s === sortHeaderId)) {
      let value;
      const id = sortHeaderId as (Stats | 'player');
      switch (id) {
        case 'player': value = data.player.full_name; break;
        default: value = data.stats ? data.stats[id] : 0; break;
      }
      if (typeof value === 'string' && !value.trim()) {
        return value;
      }

      return isNaN(+value) ? value : +value;
    }

    return 0;
  }

  public ngOnDestroy(): void {
    if (this.dataSource !== undefined) {
      this.dataSource.disconnect();
    }
    this.subscription.unsubscribe();
  }
}
