import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Data, Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, filter, tap } from 'rxjs';

import { Breadcrumb } from './breadcrumb.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  readonly #router = inject(Router);
  readonly #title = inject(Title);
  readonly #breadcrumbs$ = new BehaviorSubject<Array<Breadcrumb>>([]);

  public readonly breadcrumbs$ = this.#breadcrumbs$.asObservable();

  public init(defaultTitle?: string): Observable<Event> {
    return this.#router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap(() => {
        // Construct the breadcrumb hierarchy
        const { root } = this.#router.routerState.snapshot;
        const breadcrumbs: Array<Breadcrumb> = [];
        this.#addBreadcrumb(root, [], breadcrumbs);
        const array = [];
        if (defaultTitle) {
          array.push(defaultTitle);
        }
        this.#title.setTitle([...array, ...breadcrumbs.map((b) => b.label)].join(' - '));

        if (breadcrumbs.length === 0 && defaultTitle) {
          breadcrumbs.push({
            label: defaultTitle,
            url: '/',
          });
        }
        // Emit the new hierarchy
        this.#breadcrumbs$.next(breadcrumbs);
      }),
    );
  }

  public connect(defaultTitle?: string): Subscription {
    return this.init(defaultTitle).subscribe();
  }

  #addBreadcrumb(
    route: ActivatedRouteSnapshot | null,
    parentUrl: Array<string>,
    breadcrumbs: Array<Breadcrumb>,
  ): void {
    if (route) {
      // Construct the route URL
      const routeUrl = [...parentUrl, ...route.url.map((url) => url.path)];

      // Add an element for the current route part
      if (route.data['breadcrumbs'] !== undefined) {
        const breadcrumb = {
          label: this.#getLabel(route.data),
          url: `/${routeUrl.join('/')}`,
        };
        breadcrumbs.push(breadcrumb);
      }

      // Add another element for the next route part
      this.#addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  #getLabel(data: Data): string {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    const breadcrumb = data['breadcrumbs'] as string | ((data: Data) => string);

    return typeof breadcrumb === 'function' ? breadcrumb(data) : breadcrumb;
  }
}
