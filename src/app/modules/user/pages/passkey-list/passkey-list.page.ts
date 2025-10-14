import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';

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

  protected readonly passkeys = this.#pbcsService.indexResource(this.#auth.currentUser);
  protected readonly isSupported$ = this.#webauthnService.browserSupportsWebAuthn();

  protected async register(): Promise<void> {
    const passkey = await this.#webauthnService.startRegistration();
    if (passkey) {
      this.passkeys.reload();
    }
  }

  protected async unregister(publicKey: PublicKeyCredentialSource): Promise<boolean> {
    const user = this.#auth.currentUser()!;

    await firstValueFrom(this.#pbcsService.delete(user.id, publicKey.id), { defaultValue: false });

    return this.passkeys.reload();
  }
}
