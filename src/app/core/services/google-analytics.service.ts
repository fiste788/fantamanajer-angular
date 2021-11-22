import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { environment } from '@env';

declare let gtag: Gtag.Gtag;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly router: Router,
  ) {}

  public load(): Observable<boolean> {
    if (environment.gaCode !== '') {
      const script = this.document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaCode}`;
      this.document.head.prepend(script);

      return this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e) => {
          gtag('config', environment.gaCode ?? '', {
            page_path: e.urlAfterRedirects,
          });

          return true;
        }),
      );
    }

    return of(false);
  }
}
