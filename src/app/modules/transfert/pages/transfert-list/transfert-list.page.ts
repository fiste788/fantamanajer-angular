import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, viewChild, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { combineLatest, Observable, map, switchMap } from 'rxjs';

import { addVisibleClassOnDestroy, getRouteData } from '@app/functions';
import { ApplicationService } from '@app/services';
import { TransfertService } from '@data/services';
import { Team, Transfert } from '@data/types';
import { SelectionComponent } from '@modules/selection/components/selection/selection.component';
import { tableRowAnimation } from '@shared/animations';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { SeasonActiveDirective } from '@shared/directives';

@Component({
  animations: [tableRowAnimation],
  templateUrl: './transfert-list.page.html',
  imports: [
    MatTableModule,
    MatSortModule,
    RouterLink,
    MatIconModule,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    SeasonActiveDirective,
    SelectionComponent,
    AsyncPipe,
    MatCardModule,
  ],
})
export class TransfertListPage {
  readonly #transfertService = inject(TransfertService);
  readonly #ref = inject(ChangeDetectorRef);

  public sort = viewChild(MatSort);
  protected readonly app = inject(ApplicationService);

  protected readonly team$ = getRouteData<Team>('team');
  protected readonly dataSource$ = this.loadData();
  protected readonly isMyTeam$ = combineLatest([
    this.team$,
    toObservable(this.app.requireTeam),
  ]).pipe(map(([cur, my]) => cur.id === my.id));

  protected readonly displayedColumns = ['old_member', 'new_member', 'constraint', 'matchday'];

  constructor() {
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  protected loadData(): Observable<MatTableDataSource<Transfert>> {
    return this.team$.pipe(
      switchMap((team) => this.#transfertService.getTransfert(team.id)),
      map((data) => {
        const ds = new MatTableDataSource<Transfert>(data);
        if (data.length > 0) {
          ds.sortingDataAccessor = this.sortingDataAccessor.bind(this);
          this.#ref.detectChanges();
        }

        return ds;
      }),
    );
  }

  protected sortingDataAccessor(data: Transfert, sortHeaderId: string): string {
    let value;
    switch (sortHeaderId) {
      case 'old_member': {
        value = data.old_member.player.full_name;
        break;
      }
      case 'new_member': {
        value = data.new_member.player.full_name;
        break;
      }
      default:
    }

    return value ?? '';
  }

  protected trackTransfert(_: number, item: Transfert): number {
    return item.id;
  }

  protected setSort(ds: MatTableDataSource<Transfert>): void {
    const sort = this.sort();
    if (sort) {
      ds.sort = sort;
    }
  }
}
