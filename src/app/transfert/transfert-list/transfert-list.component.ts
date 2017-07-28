import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { Transfert } from '../transfert';
import { TransfertService } from '../transfert.service';

@Component({
  selector: 'fm-transfert-list',
  templateUrl: './transfert-list.component.html',
  styleUrls: ['./transfert-list.component.scss']
})
export class TransfertListComponent implements OnInit {

  transferts: Transfert[];
  dataSource: TransfertDataSource | null;
  displayedColumns = [
    'old_member',
    'new_member',
    'contraint',
    'matchday'
  ];

  constructor(private transfertService: TransfertService,
    private changeRef: ChangeDetectorRef,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    const team_id = this.getTeamId();
    this.transfertService.getTransfert(team_id).then(transferts => {
      this.transferts = transferts;
      this.dataSource = new TransfertDataSource(this);
    });
    this.changeRef.detectChanges();
  }

  getTeamId(): number {
    for (const x in this.route.snapshot.pathFromRoot) {
      if (this.route.pathFromRoot.hasOwnProperty(x)) {
        const current = this.route.snapshot.pathFromRoot[x];
        if (current.params.hasOwnProperty('team_id')) {
          return parseInt(current.params['team_id'], 10);
        }
      }
    }
  }
}
export class TransfertDataSource extends DataSource<Transfert> {
  constructor(private component: TransfertListComponent) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Transfert[]> {
    return Observable.of(this.component.transferts);
    // return this.component.members;
  }

  disconnect() {}
}
