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
    this.iconRegistry.addSvgIconSet(
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/fantamanajer-icons.svg'),
    );
    this.head = document.head;
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
      let mainEl = this.document.getElementById('main-theme') as HTMLLinkElement | null;
      if (mainEl !== null) {
        const isLoadedDark = mainEl.href.startsWith('dark');
        let altEl = this.document.getElementById('alternate-theme') as HTMLLinkElement | null;
        const styleName = `${isDark ? 'dark' : 'light'}-color-theme.css`;
        if (isLoadedDark !== isDark) {
          if (altEl !== null) {
            this.enableAlternate(altEl);
          } else {
            altEl = this.createLink(styleName, 'alternate-theme');
            this.renderer.setProperty(altEl, 'onload', resolve);
            this.renderer.appendChild(this.head, altEl);
          }
        } else {
          this.disableAlternate(altEl);
        }
      } else {
        mainEl = this.createLink(`${isDark ? 'dark' : 'light'}-theme.css`, 'main-theme');
        this.renderer.setProperty(mainEl, 'onload', resolve);
        this.renderer.appendChild(this.head, mainEl);
      }
    });
  }

  private disableAlternate(altEl: HTMLLinkElement | null): void {
    if (altEl !== null && !altEl.disabled) {
      this.renderer.setAttribute(altEl, 'disabled', 'disabled');
    }
  }

  private enableAlternate(altEl: HTMLLinkElement | null): void {
    if (altEl !== null && altEl.disabled) {
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
