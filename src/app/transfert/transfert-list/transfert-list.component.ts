import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { Transfert } from '../transfert';
import { TransfertService } from '../transfert.service';
import { SelectionComponent } from '../../selection/selection/selection.component';
import { SharedService } from '../../shared/shared.service';
import { of } from 'rxjs/observable/of';
import { share } from 'rxjs/operators';

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

  disconnect() { }
}
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
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.dataSource = new TransfertDataSource(
      this.transfertService,
      this.sharedService.getTeamId(this.route)
    );
  }
}
