import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly isDark$: Observable<boolean>;
  private readonly theme$: Observable<void>;
  private readonly renderer: Renderer2;
  private readonly head: HTMLHeadElement;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly rendererFactory: RendererFactory2,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    this.iconRegistry.addSvgIconSet(
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/fantamanajer-icons.svg'),
    );
    this.head = document.head;
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
      let mainEl = this.document.querySelector<HTMLLinkElement>('#main-theme');
      if (mainEl === null) {
        mainEl = this.createLink(`${isDark ? 'dark' : 'light'}-theme.css`, 'main-theme');
        this.renderer.setProperty(mainEl, 'onload', resolve);
        this.renderer.appendChild(this.head, mainEl);
      } else {
        const isLoadedDark = mainEl.href.startsWith('dark');
        const styleName = `${isDark ? 'dark' : 'light'}-color-theme.css`;
        let altEl = this.document.querySelector<HTMLLinkElement>('alternate-theme');
        if (isLoadedDark === isDark) {
          this.disableAlternate(altEl);
        } else if (altEl === null) {
          altEl = this.createLink(styleName, 'alternate-theme');
          this.renderer.setProperty(altEl, 'onload', resolve);
          this.renderer.appendChild(this.head, altEl);
        } else {
          this.enableAlternate(altEl);
        }
      }
    });
  }

  private disableAlternate(altEl: HTMLLinkElement | null): void {
    if (altEl?.disabled === false) {
      this.renderer.setAttribute(altEl, 'disabled', 'disabled');
    }
  }

  private enableAlternate(altEl: HTMLLinkElement | null): void {
    if (altEl?.disabled) {
      this.renderer.removeAttribute(altEl, 'disabled');
    }
  }

  private createLink(href: string, id: string): HTMLLinkElement {
    const altEl = this.renderer.createElement('link') as HTMLLinkElement;
    this.renderer.setAttribute(altEl, 'rel', 'stylesheet');
    this.renderer.setAttribute(altEl, 'type', 'text/css');
    this.renderer.setAttribute(altEl, 'id', id);
    this.renderer.setAttribute(altEl, 'href', href);

    return altEl;
  }
}
