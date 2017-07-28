import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { Member } from '../member';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'fm-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  @Input() members: Member[];
  @Input() hideClub = false;
  dataSource: MemberDataSource | null;
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

  constructor(private changeRef: ChangeDetectorRef) {
    this.dataSource = new MemberDataSource(this);
  }

  ngOnInit() {
    if (this.hideClub) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('club'), 1);
    }
    this.changeRef.detectChanges();
  }

}
export class MemberDataSource extends DataSource<Member> {
  constructor(private component: MemberListComponent) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Member[]> {
    return Observable.of(this.component.members);
    // return this.component.members;
  }

  disconnect() {}
}
