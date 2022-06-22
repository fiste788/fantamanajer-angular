import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { ApplicationService } from '@app/services';
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

  protected readonly isMyTeam$: Observable<boolean>;
  protected readonly team$: Observable<Team>;
  protected readonly dataSource$: Observable<MatTableDataSource<Transfert>>;
  protected readonly displayedColumns = ['old_member', 'new_member', 'constraint', 'matchday'];

  constructor(
    protected readonly app: ApplicationService,
    private readonly transfertService: TransfertService,
    private readonly ref: ChangeDetectorRef,
  ) {
    this.team$ = getRouteData<Team>('team');
    this.isMyTeam$ = combineLatest([this.team$, app.requireTeam$]).pipe(
      map(([cur, my]) => cur.id === my.id),
    );
    this.dataSource$ = this.loadData();
  }

  protected loadData(): Observable<MatTableDataSource<Transfert>> {
    return this.team$.pipe(
      switchMap((team) => this.transfertService.getTransfert(team.id)),
      map((data) => {
        const ds = new MatTableDataSource<Transfert>(data);
        if (data.length) {
          ds.sortingDataAccessor = this.sortingDataAccessor.bind(this);
          this.ref.detectChanges();
        }
        return ds;
      }),
    );
  }

  protected sortingDataAccessor(data: Transfert, sortHeaderId: string): string {
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

  protected trackTransfert(_: number, item: Transfert): number {
    return item.id;
  }

  protected setSort(ds: MatTableDataSource<Transfert>): void {
    if (this.sort) {
      ds.sort = this.sort;
    }
  }
}
