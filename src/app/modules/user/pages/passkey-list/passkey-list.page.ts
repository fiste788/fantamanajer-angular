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
import type { PublicKeyCredentialSource } from '@data/interfaces';
import { PublicKeyCredentialSourceService, WebauthnService } from '@data/services';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  imports: [AsyncPipe, DatePipe, MatButtonModule, MatEmptyStateComponent, MatIconModule, MatListModule, MatProgressSpinnerModule, MatSortModule, MatTableModule],
  templateUrl: './passkey-list.page.html',
})
export class PasskeyListPage {

  readonly #auth = inject(AuthenticationService);
  readonly #pbcsService = inject(PublicKeyCredentialSourceService);
  readonly #webauthnService = inject(WebauthnService);

  protected readonly isSupported$ = this.#webauthnService.browserSupportsWebAuthn();
  protected readonly passkeys = this.#pbcsService.indexResource(this.#auth.currentUser);

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
