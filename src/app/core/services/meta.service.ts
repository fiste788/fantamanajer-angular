import { inject, Service } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import type { Data } from '@angular/router';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { filter, map, tap } from 'rxjs';
import type { Subscription } from 'rxjs';

interface SEOData {
  description?: ((data: Data) => string) | string | undefined;
  ogDescription?: ((data: Data) => string) | string | undefined;
  ogImage?: ((data: Data) => string) | string | undefined;
  ogTitle?: ((data: Data) => string) | string | undefined;
  ogUrl?: ((data: Data) => string) | string | undefined;
  robots?: ((data: Data) => string) | string | undefined;
}

@Service()
export class MetaService {

  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #metaService = inject(Meta);
  readonly #router = inject(Router);

  public connect(): Subscription {
    return this.#router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.#getChild(this.#activatedRoute).snapshot),

        map(route => (route.data['parent'] ? route.parent! : route).data),
        tap((data: SEOData) => {
          this.#setTag('description', data, 'description');
          this.#setTag('robots', data, 'robots', 'follow,index');
          this.#setTag('og:url', data, 'ogUrl', this.#router.url);
          this.#setTag('og:title', data, 'ogTitle');
          this.#setTag('og:description', data, 'ogDescription');
          this.#setTag('og:image', data, 'ogImage');
        }),
      )
      .subscribe();
  }

  #getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.#getChild(activatedRoute.firstChild);
    }

    return activatedRoute;
  }

  #getLabel(content: ((data: Data) => string) | string, data: Data): string {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof content === 'function' ? content(data) : content;
  }

  #setTag(property: string, data: SEOData, key: keyof SEOData, defaultValue?: string): void {
    const meta = data[key];
    if (meta !== undefined) {
      this.#metaService.updateTag({ content: this.#getLabel(meta, data), property });
    } else if (defaultValue) {
      this.#metaService.updateTag({ content: defaultValue, property });
    } else {
      this.#metaService.removeTag(`property='${property}'`);
    }
  }

}
