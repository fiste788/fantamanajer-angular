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
  teamId: number;
  dataSource = new MatTableDataSource<Transfert>();
  displayedColumns = ['old_member', 'new_member', 'constraint', 'matchday'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private transfertService: TransfertService,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.teamId = this.sharedService.getTeamId(this.route);
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    // this.dataSource._updateChangeSubscription = () => this.dataSource.sort = this.sort;
    this.transfertService.getTransfert(this.teamId).subscribe(data => {
      this.dataSource.data = data;
      this.ref.detectChanges();
      this.dataSource.sort = this.sort;
    });

  }

  sortingDataAccessor(data, sortHeaderId) {
    let value = null;
    switch (sortHeaderId) {
      case 'old_member':
      case 'new_member': value = (data.player.name ? (data.player.name + ' ') : data.player.name) + data.player.surname; break;
      default: value = data.stats[sortHeaderId]; break;
    }
    if (typeof value === 'string' && !value.trim()) {
      return value;
    }
    return isNaN(+value) ? value : +value;
  }
}
