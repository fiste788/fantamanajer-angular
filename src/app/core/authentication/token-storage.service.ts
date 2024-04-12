import { Injectable } from '@angular/core';

import { LocalstorageService } from '@app/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly TOKEN_ITEM_NAME = 'token';

  constructor(private readonly localStorage: LocalstorageService) {}

  get token(): string | undefined {
    return this.localStorage.getItem(this.TOKEN_ITEM_NAME) ?? undefined;
  }

  public setToken(token: string): void {
    this.localStorage.setItem(this.TOKEN_ITEM_NAME, token);
  }

  public deleteToken(): void {
    this.localStorage.removeItem(this.TOKEN_ITEM_NAME);
  }
}
