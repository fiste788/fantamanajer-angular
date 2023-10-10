import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly TOKEN_ITEM_NAME = 'token';

  get token(): string | undefined {
    return localStorage.getItem(this.TOKEN_ITEM_NAME) ?? undefined;
  }

  public setToken(token: string): void {
    localStorage.setItem(this.TOKEN_ITEM_NAME, token);
  }

  public deleteToken(): void {
    localStorage.removeItem(this.TOKEN_ITEM_NAME);
  }
}
