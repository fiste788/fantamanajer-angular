import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthenticationStorageService {
  private readonly TOKEN_ITEM_NAME = 'token';
  private _TOKEN: string | undefined;

  constructor() {
    this._TOKEN = localStorage.getItem(this.TOKEN_ITEM_NAME) ?? undefined;
  }

  get token(): string | undefined {
    return this._TOKEN;
  }

  public setToken(token: string, rememberMe: boolean): void {
    this._TOKEN = token;
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_ITEM_NAME, token);
    } else {
      sessionStorage.setItem(this.TOKEN_ITEM_NAME, token);
    }
  }

  public deleteToken(): void {
    this._TOKEN = undefined;
    localStorage.removeItem(this.TOKEN_ITEM_NAME);
    sessionStorage.removeItem(this.TOKEN_ITEM_NAME);
  }
}
