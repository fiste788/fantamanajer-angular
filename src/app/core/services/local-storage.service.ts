import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { CookieStorage } from './cookie-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService implements Storage {
  readonly #storage: Storage = isPlatformBrowser(inject(PLATFORM_ID))
    ? localStorage
    : inject(CookieStorage);

  [name: string]: unknown;
  public length = 0;

  public clear(): void {
    this.#storage.clear();
  }

  public getItem(key: string): string | null {
    return this.#storage.getItem(key);
  }

  public key(index: number): string | null {
    return this.#storage.key(index);
  }

  public removeItem(key: string): void {
    return this.#storage.removeItem(key);
  }

  public setItem(key: string, value: string): void {
    return this.#storage.setItem(key, value);
  }
}
