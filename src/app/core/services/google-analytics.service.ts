import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

declare let gtag: Gtag.Gtag;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private readonly renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly rendererFactory: RendererFactory2,
    private readonly router: Router,
  ) {
    // eslint-disable-next-line unicorn/no-null
    this.renderer = this.rendererFactory.createRenderer(undefined, null);
  }

  public init(gaCode: string): Observable<void> {
    if (gaCode !== '') {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      this.renderer.setProperty(script, 'async', true);
      this.renderer.setProperty(script, 'defer', true);
      this.renderer.setProperty(
        script,
        'src',
        `https://www.googletagmanager.com/gtag/js?id=${gaCode}`,
      );
      this.renderer.appendChild(this.document.head, script);

      return this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e) =>
          gtag('config', gaCode, {
            page_path: e.urlAfterRedirects,
          }),
        ),
      );
    }

    return EMPTY;
  }
}
