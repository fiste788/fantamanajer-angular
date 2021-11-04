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
  public isDark$: Observable<boolean>;
  public theme$: Observable<void>;

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
    // eslint-disable-next-line no-null/no-null
    this.renderer = this.rendererFactory.createRenderer(undefined, null);
    this.isDark$ = this.breakpointObserver
      .observe('(prefers-color-scheme: dark)')
      .pipe(map((result) => result.matches));
    this.theme$ = this.isDark$.pipe(
      switchMap(async (dark) => this.setThemeCss(dark)),
      share(),
    );
  }

  connect(): Subscription {
    return this.theme$.subscribe();
  }

  private async setThemeCss(isDark: boolean): Promise<void> {
    return this.loadStyle(`${isDark ? 'dark' : 'light'}-theme.css`);
  }

  private async loadStyle(styleName: string): Promise<void> {
    return new Promise((resolve) => {
      let linkEl = this.document.getElementById('client-theme');
      if (linkEl !== null) {
        this.renderer.setAttribute(linkEl, 'href', styleName);
      } else {
        linkEl = this.renderer.createElement('link') as HTMLLinkElement;
        this.renderer.setAttribute(linkEl, 'rel', 'stylesheet');
        this.renderer.setAttribute(linkEl, 'id', 'client-theme');
        this.renderer.setAttribute(linkEl, 'type', 'text/css');
        this.renderer.setAttribute(linkEl, 'href', styleName);
        this.renderer.setProperty(linkEl, 'onload', resolve);
        this.renderer.appendChild(this.head, linkEl);
      }
    });
  }
}
