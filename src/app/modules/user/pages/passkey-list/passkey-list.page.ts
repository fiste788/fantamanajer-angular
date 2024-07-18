import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  animations: [listItemAnimation],
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
  readonly #webauthnService = inject(WebauthnService);
  readonly #pbcsService = inject(PublicKeyCredentialSourceService);
  readonly #auth = inject(AuthenticationService);

  protected readonly refresh$ = new BehaviorSubject(true);
  protected readonly passkeys$ = this.getDataSource();
  protected readonly isSupported$ = this.#webauthnService.browserSupportsWebAuthn();
  // protected readonly displayedColumns = ['name', 'created_at', 'counter', 'actions'];

  constructor() {
    addVisibleClassOnDestroy(tableRowAnimation);
  }

  protected getDataSource(): Observable<Array<PublicKeyCredentialSource>> {
    return combineLatest([this.#auth.requireUser$, this.refresh$]).pipe(
      switchMap(([user]) => this.#pbcsService.index(user.id)),
    );
  }

  protected async register(): Promise<void> {
    const passkey = await this.#webauthnService.startRegistration();
    if (passkey) {
      this.refresh$.next(true);
    }
  }

  protected async unregister(publicKey: PublicKeyCredentialSource): Promise<void> {
    return firstValueFrom(
      this.#auth.requireUser$.pipe(
        switchMap((user) => this.#pbcsService.delete(user.id, publicKey.id)),
        map(() => this.refresh$.next(true)),
      ),
      { defaultValue: undefined },
    );
  }
}
