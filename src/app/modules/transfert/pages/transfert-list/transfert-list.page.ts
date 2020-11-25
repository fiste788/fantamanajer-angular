import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

import { TransfertService } from '@data/services';
import { ApplicationService, UtilService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { Team, Transfert } from '@data/types';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./transfert-list.page.scss'],
  templateUrl: './transfert-list.page.html',
})
export class TransfertListPage implements OnInit {
  @ViewChild(MatSort) public sort: MatSort;

  public teamId?: number;
  public dataSource: MatTableDataSource<Transfert>;
  public displayedColumns = ['old_member', 'new_member', 'constraint', 'matchday'];

  constructor(
    private readonly transfertService: TransfertService,
    private readonly route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    public app: ApplicationService,
  ) { }

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.teamId = UtilService.getSnapshotData<Team>(this.route, 'team')?.id;
    if (this.teamId) {
      // this.dataSource._updateChangeSubscription = () => this.dataSource.sort = this.sort;
      this.transfertService.getTransfert(this.teamId)
        .subscribe((data) => {
          this.dataSource = new MatTableDataSource<Transfert>(data);
          if (data.length) {
            this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
            this.ref.detectChanges();
            this.dataSource.sort = this.sort;
          }
        });
    }
  }

  public sortingDataAccessor(data: Transfert, sortHeaderId: string): string {
    let value;
    switch (sortHeaderId) {
      case 'old_member': value = data.old_member.player.full_name; break;
      case 'new_member': value = data.new_member.player.full_name; break;
      default:
    }

    return value ?? '';
  }
}
