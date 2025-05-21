import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { combineLatest, firstValueFrom, Observable, map, switchMap } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { PublicKeyCredentialSourceService, WebauthnService } from '@data/services';
import { PublicKeyCredentialSource } from '@data/types';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  templateUrl: './passkey-list.page.html',
  imports: [
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

  protected readonly refresh = signal<boolean>(true);
  protected readonly refresh$ = toObservable(this.refresh);
  protected readonly passkeys$ = this.getDataSource();
  protected readonly isSupported$ = this.#webauthnService.browserSupportsWebAuthn();
  // protected readonly displayedColumns = ['name', 'created_at', 'counter', 'actions'];

  protected getDataSource(): Observable<Array<PublicKeyCredentialSource>> {
    return combineLatest([this.#auth.requireUser$, this.refresh$]).pipe(
      switchMap(([user]) => this.#pbcsService.index(user.id)),
    );
  }

  protected async register(): Promise<void> {
    const passkey = await this.#webauthnService.startRegistration();
    if (passkey) {
      this.refresh.set(true);
    }
  }

  protected async unregister(publicKey: PublicKeyCredentialSource): Promise<void> {
    return firstValueFrom(
      this.#auth.requireUser$.pipe(
        switchMap((user) => this.#pbcsService.delete(user.id, publicKey.id)),
        map(() => this.refresh.set(true)),
      ),
      { defaultValue: undefined },
    );
  }
}
