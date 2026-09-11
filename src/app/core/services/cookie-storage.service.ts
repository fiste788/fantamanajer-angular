import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, PLATFORM_ID, REQUEST, Service } from '@angular/core';

@Service()
export class CookieStorageService implements Storage {

  readonly #document = inject(DOCUMENT);
  readonly #documentIsAccessible = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #request = inject(REQUEST, { optional: true });

  public readonly length = 0;

  public check(name: string): boolean {
    const nameEncoded = encodeURIComponent(name);
    const regExp: RegExp = CookieStorageService.getCookieRegExp(nameEncoded);

    return regExp.test(this.#documentIsAccessible ? this.#document.cookie : (this.#request?.headers.get('cookie') ?? ''));
  }

  public clear(): void {
    void 0;
  }

  public static cookieString(
    name: string,
    value: string,
    options?: {
      domain?: string | undefined;
      expires?: Date | number | undefined;
      partitioned?: boolean | undefined;
      path?: string | undefined;
      sameSite?: 'Lax' | 'None' | 'Strict' | undefined;
      secure?: boolean | undefined;
    },
  ): string {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};`;

    if (options?.expires !== undefined) {
      const dateExpires = typeof options.expires === 'number' ? new Date(options.expires) : options.expires;

      cookieString += `expires=${dateExpires.toUTCString()};`;
    }

    if (options?.path) {
      cookieString += `path=${options.path};`;
    }

    if (options?.domain) {
      cookieString += `domain=${options.domain};`;
    }

    if (options?.secure === false && options.sameSite === 'None') {
      options.secure = true;
    }

    if (options?.secure) {
      cookieString += 'secure;';
    }

    if (options && !options.sameSite) {
      options.sameSite = 'Lax';
    }

    cookieString += `sameSite=${options?.sameSite};`;

    if (options?.partitioned) {
      cookieString += 'Partitioned;';
    }

    return cookieString;
  }

  public static getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replaceAll(/([$()*+,.;=?[\]^{|}])/gi, String.raw`\$1`);

    return new RegExp(String.raw`(?:^${escapedName}|;\s*${escapedName})=(.*?)(?:;|$)`, 'g');
  }

  public getItem(name: string): string {
    if (this.check(name)) {
      const nameEncoded = encodeURIComponent(name);

      const regExp: RegExp = CookieStorageService.getCookieRegExp(nameEncoded);
      const result: RegExpExecArray | null = regExp.exec(this.#documentIsAccessible ? this.#document.cookie : (this.#request?.headers.get('cookie') ?? ''));

      return result?.[1] ? CookieStorageService.safeDecodeURIComponent(result[1]) : '';
    }

    return '';
  }

  public key(_: number): string | null {
    return null;
  }

  public removeItem(name: string, path?: string, domain?: string, isSecure?: boolean, sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'): void {
    if (!this.#documentIsAccessible) {
      return;
    }
    const expiresDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
    this.setItem(name, '', { domain, expires: expiresDate, path, sameSite, secure: isSecure });
  }

  public static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      // probably it is not URI encoded. return as is
      return encodedURIComponent;
    }
  }

  public setItem(
    name: string,
    value: string,
    options?: {
      domain?: string | undefined;
      expires?: Date | number | undefined;
      partitioned?: boolean | undefined;
      path?: string | undefined;
      sameSite?: 'Lax' | 'None' | 'Strict' | undefined;
      secure?: boolean | undefined;
    },
  ): void {
    if (!this.#documentIsAccessible) {
      return;
    }

    this.#document.cookie = CookieStorageService.cookieString(name, value, options);
  }

  [name: string]: unknown;

}
