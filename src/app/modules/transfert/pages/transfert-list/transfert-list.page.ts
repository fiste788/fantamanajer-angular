import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { combineLatest, map, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { AppService } from '@app/services';
import type { Team, Transfer } from '@data/interfaces';
import { TransfertService } from '@data/services';
import { SelectionComponent } from '@modules/selection/components/selection/selection.component';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';
import { SeasonActiveDirective } from '@shared/directives';

@Component({
  imports: [
    AsyncPipe,
    MatCardModule,
    MatEmptyStateComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    RouterLink,
    SeasonActiveDirective,
    SelectionComponent,
  ],
  templateUrl: './transfert-list.page.html',
})
export class TransfertListPage {

  readonly #ref = inject(ChangeDetectorRef);
  readonly #transfertService = inject(TransfertService);
  protected readonly app = inject(AppService);

  public readonly sort = viewChild(MatSort);

  protected readonly dataSource$ = this.loadData();
  protected readonly displayedColumns = ['old_member', 'new_member', 'constraint', 'matchday'];
  protected readonly team$ = getRouteData<Team>('team');
  protected readonly isMyTeam$ = combineLatest([this.team$, toObservable(this.app.requireCurrentTeam)]).pipe(map(([current, my]) => current.id === my.id));

  protected loadData(): Observable<MatTableDataSource<Transfer>> {
    return this.team$.pipe(
      switchMap(team => this.#transfertService.getTeamTransferts(team.id)),
      map((data) => {
        const ds = new MatTableDataSource<Transfer>(data);
        if (data.length > 0) {
          ds.sortingDataAccessor = this.sortingDataAccessor.bind(this);
          this.#ref.detectChanges();
        }

        return ds;
      }),
    );
  }

  protected setSort(ds: MatTableDataSource<Transfer>): void {
    const sort = this.sort();
    if (sort) {
      ds.sort = sort;
    }
  }

  protected sortingDataAccessor(data: Transfer, sortHeaderId: string): string {
    let value;
    switch (sortHeaderId) {
      case 'new_member':
        value = data.new_member.player.full_name;
        break;
      case 'old_member':
        value = data.old_member.player.full_name;
        break;
      default:
    }

    return value ?? '';
  }

  protected trackTransfert(_: number, item: Transfer): number {
    return item.id;
  }

}
