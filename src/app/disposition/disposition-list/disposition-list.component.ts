import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { Disposition } from '../../disposition/disposition';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'fm-disposition-list',
  templateUrl: './disposition-list.component.html',
  styleUrls: ['./disposition-list.component.scss']
})
export class DispositionListComponent implements OnInit {

  @Input() public dispositions: Disposition[];
  @Input() public caption: string;

  dataSource: DispositionDataSource | null;
  displayedColumns = ['player', 'role', 'club', 'regular', 'yellowCard', 'redCard', 'assist', 'goals', 'points'];

  constructor(private changeRef: ChangeDetectorRef) {
    this.dataSource = new DispositionDataSource(this);
  }

  ngOnInit() {
    this.changeRef.detectChanges();
  }
}
export class DispositionDataSource extends DataSource<Disposition> {
  constructor(private dispositionListComponent: DispositionListComponent) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Disposition[]> {
    const dispositions: Disposition[] = this.dispositionListComponent.dispositions;
    console.log( dispositions);
    return Observable.of(dispositions);
  }

  disconnect() {}
}
