import { Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, ActivatedRoute, Router, Data } from '@angular/router';
import { Subscription, filter, map, tap } from 'rxjs';

interface SEOData {
  description?: string | ((data: Data) => string);
  robots?: string | ((data: Data) => string);
  ogUrl?: string | ((data: Data) => string);
  ogTitle?: string | ((data: Data) => string);
  ogDescription?: string | ((data: Data) => string);
  ogImage?: string | ((data: Data) => string);
}

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #metaService = inject(Meta);

  public connect(): Subscription {
    return this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.#getChild(this.#activatedRoute).snapshot),
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        map((route) => (route.data['parent'] ? route.parent!.data : route.data)),
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

  #setTag(property: string, data: SEOData, key: keyof SEOData, defaultValue?: string): void {
    const meta = data[key];
    if (meta !== undefined) {
      this.#metaService.updateTag({ property, content: this.#getLabel(meta, data) });
    } else if (defaultValue) {
      this.#metaService.updateTag({ property, content: defaultValue });
    } else {
      this.#metaService.removeTag(`property='${property}'`);
    }
  }

  #getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.#getChild(activatedRoute.firstChild);
    }

    return activatedRoute;
  }

  #getLabel(content: string | ((data: Data) => string), data: Data): string {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof content === 'function' ? content(data) : content;
  }
}
