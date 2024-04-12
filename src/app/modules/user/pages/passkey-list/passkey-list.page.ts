import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { addVisibleClassOnDestroy } from '@app/functions';
import { PublicKeyCredentialSourceService, WebauthnService } from '@data/services';
import { PublicKeyCredentialSource } from '@data/types';
import { listItemAnimation, tableRowAnimation } from '@shared/animations';
import { MatEmptyStateComponent } from '@shared/components';

@Component({
  animations: [listItemAnimation],
  styleUrl: './passkey-list.page.scss',
  templateUrl: './passkey-list.page.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DatePipe,
  ],
})
export class PasskeyListPage {
  protected readonly passkeys$: Observable<Array<PublicKeyCredentialSource>>;
  protected readonly refresh$: BehaviorSubject<true>;
  protected readonly isSupported$: Promise<boolean>;
  // protected readonly displayedColumns = ['name', 'created_at', 'counter', 'actions'];

  constructor(
    private readonly webauthnService: WebauthnService,
    private readonly pbcsService: PublicKeyCredentialSourceService,
    private readonly auth: AuthenticationService,
  ) {
    this.refresh$ = new BehaviorSubject(true);
    this.passkeys$ = this.getDataSource();
    this.isSupported$ = this.webauthnService.isSupported();
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  protected getDataSource(): Observable<Array<PublicKeyCredentialSource>> {
    return combineLatest([this.auth.requireUser$, this.refresh$]).pipe(
      switchMap(([user]) => this.pbcsService.index(user.id)),
    );
  }

  protected async register(): Promise<void> {
    const passkey = await this.webauthnService.createPasskey();
    if (passkey) {
      this.refresh$.next(true);
    }
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
}
