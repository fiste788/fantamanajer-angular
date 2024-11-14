/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-null */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { REQUEST } from '@app/tokens';

@Injectable({
  providedIn: 'root',
})
export class CookieStorage implements Storage {
  readonly #document = inject(DOCUMENT);
  readonly #request = inject(REQUEST, { optional: true });
  readonly #documentIsAccessible = isPlatformBrowser(inject(PLATFORM_ID));

  [name: string]: unknown;
  public readonly length = 0;

  /**
   * Get cookie Regular Expression
   *
   * @param name Cookie name
   * @returns property RegExp
   *
   * @author: Stepan Suvorov
   * @since: 1.0.0
   */
  public static getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replaceAll(/([$()*+,.;=?[\]^{|}])/gi, String.raw`\$1`);

    return new RegExp(`(?:^${escapedName}|;\\s*${escapedName})=(.*?)(?:;|$)`, 'g');
  }

  /**
   * Gets the unencoded version of an encoded component of a Uniform Resource Identifier (URI).
   *
   * @param encodedURIComponent A value representing an encoded URI component.
   *
   * @returns The unencoded version of an encoded component of a Uniform Resource Identifier (URI).
   *
   * @author: Stepan Suvorov
   * @since: 1.0.0
   */
  public static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      // probably it is not uri encoded. return as is
      return encodedURIComponent;
    }
  }

  public static cookieString(
    name: string,
    value: string,
    options?: {
      expires?: Date | number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Lax' | 'None' | 'Strict';
      partitioned?: boolean;
    },
  ) {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};`;

    if (options?.expires !== undefined) {
      const dateExpires =
        typeof options.expires === 'number' ? new Date(options.expires) : options.expires;

      cookieString += `expires=${dateExpires.toUTCString()};`;
    }

    if (options?.path) {
      cookieString += `path=${options.path};`;
    }

    if (options?.domain) {
      cookieString += `domain=${options.domain};`;
    }

    if (options?.secure === false && options?.sameSite === 'None') {
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

  /**
   * Return `true` if {@link Document} is accessible, otherwise return `false`
   *
   * @param name Cookie name
   * @returns boolean - whether cookie with specified name exists
   *
   * @author: Stepan Suvorov
   * @since: 1.0.0
   */
  public check(name: string): boolean {
    const nameEncoded = encodeURIComponent(name);
    const regExp: RegExp = CookieStorage.getCookieRegExp(nameEncoded);

    return regExp.test(
      this.#documentIsAccessible
        ? this.#document.cookie
        : (this.#request?.headers.get('cookie') ?? ''),
    );
  }

  /**
   * Get cookies by name
   *
   * @param name Cookie name
   * @returns property value
   *
   * @author: Stepan Suvorov
   * @since: 1.0.0
   */
  public getItem(name: string): string {
    if (this.check(name)) {
      const nameEncoded = encodeURIComponent(name);

      const regExp: RegExp = CookieStorage.getCookieRegExp(nameEncoded);
      const result: RegExpExecArray | null = regExp.exec(
        this.#documentIsAccessible
          ? this.#document.cookie
          : (this.#request?.headers.get('cookie') ?? ''),
      );

      return result?.[1] ? CookieStorage.safeDecodeURIComponent(result?.[1]) : '';
    }

    return '';
  }

  public setItem(
    name: string,
    value: string,
    options?: {
      expires?: Date | number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Lax' | 'None' | 'Strict';
      partitioned?: boolean;
    },
  ): void {
    if (!this.#documentIsAccessible) {
      return;
    }

    this.#document.cookie = CookieStorage.cookieString(name, value, options);
  }

  /**
   * Delete cookie by name
   *
   * @param name   Cookie name
   * @param path   Cookie path
   * @param domain Cookie domain
   * @param secure Cookie secure flag
   * @param sameSite Cookie sameSite flag - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
   *
   * @author: Stepan Suvorov
   * @since: 1.0.0
   */
  public removeItem(
    name: string,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite: 'Lax' | 'None' | 'Strict' = 'Lax',
  ): void {
    if (!this.#documentIsAccessible) {
      return;
    }
    const expiresDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
    this.setItem(name, '', { expires: expiresDate, path, domain, secure, sameSite });
  }

  public clear(): void {
    void 0;
  }

  public key(_index: number): string | null {
    return null;
  }
}
