import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { filterNil } from '@app/functions';
import { PublicKeyCredentialSourceService, WebauthnService } from '@data/services';
import { PublicKeyCredentialSource } from '@data/types';
import { tableRowAnimation } from '@shared/animations';

import { MatEmptyStateComponent } from '../../../../shared/components/mat-empty-state/mat-empty-state.component';

@Component({
  animations: [tableRowAnimation],
  styleUrls: ['./device-list.page.scss'],
  templateUrl: './device-list.page.html',
  standalone: true,
  imports: [
    NgIf,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DatePipe,
  ],
})
export class DeviceListPage {
  protected readonly dataSource$: Observable<MatTableDataSource<PublicKeyCredentialSource>>;
  protected readonly refresh$: BehaviorSubject<true>;
  protected readonly displayedColumns = ['name', 'created_at', 'counter', 'actions'];

  constructor(
    private readonly webauthnService: WebauthnService,
    private readonly pbcsService: PublicKeyCredentialSourceService,
    private readonly auth: AuthenticationService,
  ) {
    this.refresh$ = new BehaviorSubject(true);
    this.dataSource$ = this.getDataSource();
  }

  protected getDataSource(): Observable<MatTableDataSource<PublicKeyCredentialSource>> {
    return combineLatest([this.auth.requireUser$, this.refresh$]).pipe(
      switchMap(([user]) => this.pbcsService.index(user.id)),
      map((data) => new MatTableDataSource<PublicKeyCredentialSource>(data)),
    );
  }

  protected async register(): Promise<void> {
    return firstValueFrom(
      this.webauthnService.createPublicKey().pipe(
        filterNil(),
        map(() => this.refresh$.next(true)),
      ),
      { defaultValue: undefined },
    );
  }

  protected async unregister(publicKey: PublicKeyCredentialSource): Promise<void> {
    return firstValueFrom(
      this.auth.requireUser$.pipe(
        switchMap((user) => this.pbcsService.delete(user.id, publicKey.id)),
        map(() => this.refresh$.next(true)),
      ),
      { defaultValue: undefined },
    );
  }

  protected trackDevice(_: number, item: PublicKeyCredentialSource): string {
    return item.id;
  }
}
