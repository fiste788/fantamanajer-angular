import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { Transfert } from '../transfert';
import { TransfertService } from '../transfert.service';
import { SelectionComponent } from '../../selection/selection/selection.component';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';

@Component({
  selector: 'fm-transfert-list',
  templateUrl: './transfert-list.component.html',
  styleUrls: ['./transfert-list.component.scss']
})
export class TransfertListComponent implements OnInit {
  transferts: Observable<Transfert[]>;
  dataSource: TransfertDataSource | null;
  displayedColumns = ['old_member', 'new_member', 'contraint', 'matchday'];

  constructor(
    private transfertService: TransfertService,
    private changeRef: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dataSource = new TransfertDataSource(
      this.transfertService,
      this.getTeamId()
    );
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
  constructor(
    private transfertService: TransfertService,
    private team_id: number
  ) {
    super();
  }

  connect(): Observable<Transfert[]> {
    return this.transfertService.getTransfert(this.team_id);
  }

  disconnect() {}
}
