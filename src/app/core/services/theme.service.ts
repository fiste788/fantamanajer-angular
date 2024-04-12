import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly isDark$: Observable<boolean>;
  private readonly theme$: Observable<void>;
  private readonly renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly rendererFactory: RendererFactory2,
    private readonly breakpointObserver: BreakpointObserver,
  ) {
    // eslint-disable-next-line unicorn/no-null
    this.renderer = this.rendererFactory.createRenderer(undefined, null);
    this.isDark$ = this.breakpointObserver
      .observe('(prefers-color-scheme: dark)')
      .pipe(map((result) => result.matches));
    this.theme$ = this.isDark$.pipe(
      switchMap(async (dark) => this.setThemeCss(dark)),
      share(),
    );
  }

  public connect(): Subscription {
    return this.theme$.subscribe();
  }

  private async setThemeCss(isDark: boolean): Promise<void> {
    return new Promise((resolve) => {
      const mainEl = this.document.querySelector<HTMLLinkElement>('#main-theme');
      const styleName = `${isDark ? 'dark' : 'light'}.css`;
      this.renderer.setProperty(mainEl, 'href', styleName);
      this.renderer.setProperty(mainEl, 'onload', resolve);
    });
  }
}
