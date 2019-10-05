import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, Output, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subscription } from 'rxjs';
import { Member } from '@app/core/models';
import { tableRowAnimation } from '@app/core/animations';

@Component({
  selector: 'fm-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
  animations: [tableRowAnimation]
})
export class MemberListComponent implements OnInit, OnDestroy {
  @Input() members: Observable<Member[]>;
  @Input() hideClub = false;
  @Input() isSelectable = false;
  @Input() multipleSelection = false;
  @Input() elevation = 1;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private subscription: Subscription;
  dataSource: MatTableDataSource<Member> = null;
  displayedColumns = [
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
    'sum_red_card'
  ];
  footer = {};
  @Output() selection = new SelectionModel<Member>(false, []);

  constructor(private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.hideClub) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('club'), 1);
    }
    if (this.isSelectable) {
      this.displayedColumns.unshift('select');
    }

    this.subscription = this.members.subscribe(data => {
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

  calcSummary(data: Member[]) {
    this.displayedColumns.forEach(column => {
      if (column.startsWith('sum') || column.startsWith('avg')) {
        this.footer[column] = 0;
        const rows = data.filter(row => row.stats && row.stats[column] > 0);
        data.forEach(row => {
          if (row.stats) {
            this.footer[column] += row.stats[column];
          }
        });
        if (column.startsWith('avg')) {
          this.footer[column] /= rows.length;
        }
      }
    });

  }

  sortingDataAccessor(data: Member, sortHeaderId: string) {
    let value = null;
    switch (sortHeaderId) {
      case 'player': value = data.player.full_name; break;
      default: value = data.stats[sortHeaderId]; break;
    }
    if (typeof value === 'string' && !value.trim()) {
      return value;
    }
    return isNaN(+value) ? value : +value;
  }

  ngOnDestroy(): void {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    this.subscription.unsubscribe();
  }
}

