import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { CookieStorage } from './cookie-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService implements Storage {
  [name: string]: unknown;
  public length = 0;
  private readonly storage: Storage;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly cookieStorage: CookieStorage,
  ) {
    this.storage = isPlatformBrowser(this.platformId) ? localStorage : this.cookieStorage;
  }

  public clear(): void {
    this.storage.clear();
  }

  public getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  public key(index: number): string | null {
    return this.storage.key(index);
  }

  public removeItem(key: string): void {
    return this.storage.removeItem(key);
  }

  public setItem(key: string, value: string): void {
    return this.storage.setItem(key, value);
  }
}
