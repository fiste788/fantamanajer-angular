import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  public isDark$: Observable<boolean> = this.breakpointObserver.observe('(prefers-color-scheme: dark)')
    .pipe(map(result => result.matches));

  private readonly renderer: Renderer2;
  private readonly head: HTMLHeadElement;
  private readonly obs: Observable<void>;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly rendererFactory: RendererFactory2,
    private readonly breakpointObserver: BreakpointObserver,
  ) {
    this.head = document.head;
    // tslint:disable-next-line: no-null-keyword
    this.renderer = this.rendererFactory.createRenderer(undefined, null);
    this.obs = this.isDark$.pipe(
      switchMap(dark => this.setTheme(dark)),
      share(),
    );
    this.connect();
  }

  public load(): Observable<void> {
    return this.obs.pipe(take(1));
  }

  public connect(): void {
    this.obs.subscribe();
  }

  public async setTheme(isDark: boolean): Promise<void> {
    return this.loadStyle(`${isDark ? 'dark' : 'light'}-theme.css`);
  }

  private async loadStyle(styleName: string): Promise<void> {
    return new Promise((resolve) => {
      let linkEl = this.document.getElementById('client-theme');
      if (linkEl !== null) {
        this.renderer.setAttribute(linkEl, 'href', styleName);
      } else {
        linkEl = this.renderer.createElement('link');
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
