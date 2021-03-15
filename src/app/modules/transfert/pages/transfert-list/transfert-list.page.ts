import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

import { TransfertService } from '@data/services';
import { ApplicationService, UtilService } from '@app/services';
import { tableRowAnimation } from '@shared/animations';
import { Team, Transfert } from '@data/types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./transfert-list.page.scss'],
  templateUrl: './transfert-list.page.html',
})
export class TransfertListPage implements OnInit {
  @ViewChild(MatSort) public sort: MatSort;

  public teamId?: number;
  public dataSource$: Observable<MatTableDataSource<Transfert>>;
  public displayedColumns = ['old_member', 'new_member', 'constraint', 'matchday'];

  constructor(
    private readonly transfertService: TransfertService,
    private readonly route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    public app: ApplicationService,
  ) {}

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.teamId = UtilService.getSnapshotData<Team>(this.route, 'team')?.id;
    if (this.teamId) {
      // this.dataSource._updateChangeSubscription = () => this.dataSource.sort = this.sort;
      this.dataSource$ = this.transfertService.getTransfert(this.teamId).pipe(
        map((data) => {
          const ds = new MatTableDataSource<Transfert>(data);
          if (data.length) {
            ds.sortingDataAccessor = this.sortingDataAccessor.bind(this);
            this.ref.detectChanges();
            ds.sort = this.sort;
          }
          return ds;
        }),
      );
    }
  }

  public sortingDataAccessor(data: Transfert, sortHeaderId: string): string {
    let value;
    switch (sortHeaderId) {
      case 'old_member':
        value = data.old_member.player.full_name;
        break;
      case 'new_member':
        value = data.new_member.player.full_name;
        break;
      default:
    }

    return value ?? '';
  }
}
