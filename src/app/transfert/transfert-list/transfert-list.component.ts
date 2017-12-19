import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Transfert } from '../transfert';
import { TransfertService } from '../transfert.service';
import { SelectionComponent } from '../../selection/selection/selection.component';
import { SharedService } from '../../shared/shared.service';
import { TableRowAnimation } from '../../shared/animations/table-row.animation';

@Component({
  selector: 'fm-transfert-list',
  templateUrl: './transfert-list.component.html',
  styleUrls: ['./transfert-list.component.scss'],
  animations: [TableRowAnimation]
})
export class TransfertListComponent implements OnInit {
  dataSource = new MatTableDataSource<Transfert>();
  displayedColumns = ['old_member', 'new_member', 'constraint', 'matchday'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private transfertService: TransfertService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const teamId = this.sharedService.getTeamId(this.route);
    // this.dataSource._updateChangeSubscription = () => this.dataSource.sort = this.sort;
    this.transfertService.getTransfert(teamId).subscribe(data => {
      this.dataSource.data = data;
      this.ref.detectChanges();
      this.dataSource.sort = this.sort;
    });

  }
}
