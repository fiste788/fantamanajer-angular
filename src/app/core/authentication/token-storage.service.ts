import { Injectable, inject, signal } from '@angular/core';

import { LocalstorageService } from '@app/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  readonly #localStorage = inject(LocalstorageService);
  readonly #TOKEN_ITEM_NAME = 'token';
  readonly #tokenChanged = signal<string | undefined>(
    this.#localStorage.getItem(this.#TOKEN_ITEM_NAME) ?? undefined,
  );

  public token = this.#tokenChanged.asReadonly();

  public setToken(token: string): void {
    this.#localStorage.setItem(this.#TOKEN_ITEM_NAME, token);
    this.#tokenChanged.set(token);
  }

  public deleteToken(): void {
    this.#localStorage.removeItem(this.#TOKEN_ITEM_NAME);
    this.#tokenChanged.set(undefined);
  }
}
