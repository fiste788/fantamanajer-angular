import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { Disposition } from '../../disposition/disposition';
import { Router, RouterModule } from '@angular/router';
import 'rxjs/add/observable/of';

@Component({
  selector: 'fm-disposition-list',
  templateUrl: './disposition-list.component.html',
  styleUrls: ['./disposition-list.component.scss']
})
export class DispositionListComponent implements OnInit {
  @Input() public dispositions: Disposition[];
  @Input() public caption: string;

  dataSource: DispositionDataSource | null;
  displayedColumns = [
    'player',
    'role',
    'club',
    'regular',
    'yellowCard',
    'redCard',
    'assist',
    'goals',
    'points'
  ];

  constructor(private changeRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.dataSource = new DispositionDataSource(this);
    // this.changeRef.detectChanges();
  }
}
export class DispositionDataSource extends DataSource<Disposition> {
  constructor(private component: DispositionListComponent) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Disposition[]> {
    const dispositions: Disposition[] = this.component.dispositions;
    return Observable.of(dispositions);
  }

  disconnect() {}
}
