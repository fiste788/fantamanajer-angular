import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public isDark$: Observable<boolean>;
  public themeChanged$: Observable<void>;

  private readonly isDarkSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly renderer: Renderer2;
  private readonly head: HTMLHeadElement;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly rendererFactory: RendererFactory2,
    private readonly breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver
      .observe('(prefers-color-scheme: dark)')
      .pipe(map((result) => result.matches))
      .subscribe(this.isDarkSubject$);
    this.head = document.head;
    // eslint-disable-next-line no-null/no-null
    this.renderer = this.rendererFactory.createRenderer(undefined, null);
    this.isDark$ = this.isDarkSubject$.asObservable();
    this.themeChanged$ = this.isDark$.pipe(
      switchMap(async (dark) => this.setThemeCss(dark)),
      share(),
    );
  }

  connect(): Subscription {
    return this.themeChanged$.subscribe();
  }

  setTheme(dark: boolean): void {
    this.isDarkSubject$.next(dark);
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
