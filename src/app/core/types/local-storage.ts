/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class LocalStorage implements Storage {
  [name: string]: unknown;
  public readonly length = 0;
  public clear(): void {}
  public getItem(_key: string): string | null {
    return null;
  }

  public key(_index: number): string | null {
    return null;
  }

  public removeItem(_key: string): void {}
  public setItem(_key: string, _value: string): void {}
}
