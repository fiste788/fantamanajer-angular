/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-null */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';

import { REQUEST } from '@app/tokens';

@Injectable({
  providedIn: 'root',
})
export class CookieStorage implements Storage {
  [name: string]: unknown;
  public readonly length = 0;
  private readonly documentIsAccessible: boolean;

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
    const escapedName: string = name.replaceAll(/([$()*+,.;=?[\]^{|}])/gi, '\\$1');

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
    let cookieString: string = `${encodeURIComponent(name)}=${encodeURIComponent(value)};`;

    if (options?.expires !== undefined) {
      if (typeof options.expires === 'number') {
        const dateExpires: Date = new Date(options.expires);

        cookieString += `expires=${dateExpires.toUTCString()};`;
      } else {
        cookieString += `expires=${options.expires.toUTCString()};`;
      }
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

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    // Get the `PLATFORM_ID` so we can check if we're in a browser.
    @Inject(PLATFORM_ID) private readonly platformId: object,
    @Optional() @Inject(REQUEST) private readonly request: Request,
  ) {
    this.documentIsAccessible = isPlatformBrowser(this.platformId);
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
      this.documentIsAccessible ? this.document.cookie : this.request?.headers.get('cookie') ?? '',
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
        this.documentIsAccessible
          ? this.document.cookie
          : this.request?.headers.get('cookie') ?? '',
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
    if (!this.documentIsAccessible) {
      return;
    }

    this.document.cookie = CookieStorage.cookieString(name, value, options);
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
    if (!this.documentIsAccessible) {
      return;
    }
    const expiresDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
    this.setItem(name, '', { expires: expiresDate, path, domain, secure, sameSite });
  }

  public clear(): void {}

  public key(_index: number): string | null {
    return null;
  }
}
