import { Injectable } from '@angular/core';

import { LocalStorage } from '@app/types/local-storage';

import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService implements Storage {
  [name: string]: unknown;
  public length = 0;
  private storage: Storage;

  constructor() {
    this.storage = new LocalStorage();

    void ApplicationService.isBrowser.subscribe((isBrowser) => {
      if (isBrowser) {
        this.storage = localStorage;
      }
    });
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
