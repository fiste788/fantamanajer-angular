import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Member } from '../member';
import { Router, RouterModule } from '@angular/router';
import { TableRowAnimation } from '../../shared/animations/table-row.animation';

@Component({
  selector: 'fm-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
  animations: [TableRowAnimation]
})
export class MemberListComponent implements OnInit {
  @Input() members: Observable<Member[]>;
  @Input() hideClub = false;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<Member>();
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

  constructor(private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.hideClub) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('club'), 1);
    }
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.members.subscribe(data => {
      this.dataSource.data = data;
      this.changeRef.detectChanges();
      this.dataSource.sort = this.sort;
    });
  }

  sortingDataAccessor(data, sortHeaderId) {
    let value = null;
    switch (sortHeaderId) {
      case 'player': value = (data.player.name ? (data.player.name + ' ') : data.player.name) + data.player.surname; break;
      default: value = data.stats[sortHeaderId]; break;
    }
    if (typeof value === 'string' && !value.trim()) {
      return value;
    }
    return isNaN(+value) ? value : +value;
  }
}

