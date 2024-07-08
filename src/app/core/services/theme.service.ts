import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Injectable, RendererFactory2, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly #document = inject(DOCUMENT);
  // eslint-disable-next-line unicorn/no-null
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);
  readonly #isDark$ = inject(BreakpointObserver)
    .observe('(prefers-color-scheme: dark)')
    .pipe(map((result) => result.matches));

  readonly #theme$ = this.#isDark$.pipe(
    switchMap(async (dark) => this.#setThemeCss(dark)),
    share(),
  );

  public connect(): Subscription {
    return this.#theme$.subscribe();
  }

  async #setThemeCss(isDark: boolean): Promise<void> {
    return new Promise((resolve) => {
      const mainEl = this.#document.querySelector<HTMLLinkElement>('#main-theme');
      const styleName = `${isDark ? 'dark' : 'light'}.css`;
      this.#renderer.setProperty(mainEl, 'href', styleName);
      this.#renderer.setProperty(mainEl, 'onload', resolve);
    });
  }
}
