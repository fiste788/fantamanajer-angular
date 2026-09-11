import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';

import { CookieStorageService } from './cookie-storage.service';

@Service()
// Modifica suggerita per la nomenclatura della classe
export class StorageService implements Storage {

  // Cambiato nome classe
  readonly #storage: Storage = isPlatformBrowser(inject(PLATFORM_ID)) ? localStorage : inject(CookieStorageService);

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
    this.#storage.removeItem(key);
  }

  public setItem(key: string, value: string): void {
    this.#storage.setItem(key, value);
  }

  [name: string]: unknown;

}
