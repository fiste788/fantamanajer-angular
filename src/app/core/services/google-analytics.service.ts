import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { environment } from '@env';

declare var gtag: Gtag.Gtag;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly router: Router,
  ) { }

  public load(): void {
    // tslint:disable-next-line: strict-type-predicates
    if (environment.gaCode !== undefined) {
      const script = this.document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaCode}`;
      this.document.head.prepend(script);

      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      )
        .subscribe((e) => {
          gtag('config', environment.gaCode ?? '', {
            page_path: e.urlAfterRedirects,
          });
        });
    }
  }
}
