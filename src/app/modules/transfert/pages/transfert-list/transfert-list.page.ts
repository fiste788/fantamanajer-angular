import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ApplicationService, UtilService } from '@app/services';
import { TransfertService } from '@data/services';
import { Team, Transfert } from '@data/types';
import { tableRowAnimation } from '@shared/animations';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./transfert-list.page.scss'],
  templateUrl: './transfert-list.page.html',
})
export class TransfertListPage {
  @ViewChild(MatSort) public sort?: MatSort;

  public teamId?: number;
  public dataSource$: Observable<MatTableDataSource<Transfert>>;
  public displayedColumns = ['old_member', 'new_member', 'constraint', 'matchday'];

  constructor(
    private readonly transfertService: TransfertService,
    private readonly route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    public app: ApplicationService,
  ) {
    this.dataSource$ = this.loadData();
  }

  public loadData(): Observable<MatTableDataSource<Transfert>> {
    return UtilService.getData<Team>(this.route, 'team').pipe(
      switchMap((team) => this.transfertService.getTransfert(team.id)),
      map((data) => {
        const ds = new MatTableDataSource<Transfert>(data);
        if (data.length) {
          ds.sortingDataAccessor = this.sortingDataAccessor.bind(this);
          this.ref.detectChanges();
          if (this.sort) {
            ds.sort = this.sort;
          }
        }
        return ds;
      }),
    );
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
