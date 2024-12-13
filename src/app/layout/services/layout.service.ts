import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, Signal, effect, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import {
  combineLatest,
  Observable,
  Subscription,
  filter,
  map,
  pairwise,
  tap,
  switchMap,
  startWith,
  first,
  distinctUntilChanged,
  share,
} from 'rxjs';

import { VisibilityState } from '@app/enums/visibility-state';
import { ScrollService } from '@app/services';

type Size = 'handset' | 'tablet' | 'web';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #scrollService = inject(ScrollService);
  readonly #router = inject(Router);
  readonly #scrollSubscription = new Map<Window, Subscription | undefined>();
  readonly #displayNameMap = new Map<string, Size>([
    [Breakpoints.XSmall, 'handset'],
    [Breakpoints.Small, 'tablet'],
    [Breakpoints.Medium, 'tablet'],
    [Breakpoints.Large, 'web'],
    [Breakpoints.XLarge, 'web'],
  ]);
  readonly #size$ = this.#size();

  public readonly size = toSignal(this.#size$, { initialValue: 'handset' });
  public readonly openSidebar = linkedSignal(() => this.size() === 'web');
  public readonly showFab = linkedSignal(() =>
    this.size() === 'handset' || this.routeContextChanged()
      ? VisibilityState.Visible
      : VisibilityState.Hidden,
  );
  public readonly showTopAppBar = linkedSignal(() =>
    this.size().length > 0 || this.routeContextChanged()
      ? VisibilityState.Visible
      : VisibilityState.Hidden,
  );
  public readonly openFab = signal(false);
  public readonly up = signal(false);
  public readonly down = signal(false);
  public readonly routeContextChanged = this.#isRouteContextChanged();
  public readonly navigationStart = this.#navigationStart();
  public stable = this.#isStable();

  constructor() {
    effect(() => this.navigationStart() !== undefined && this.closeSidebar());
  }

  public connectScrollAnimation(window: Window, offsetCallback = () => 0): Subscription {
    return this.#size$
      .pipe(
        tap((size) => {
          const subscriptions = this.#scrollSubscription.get(window);
          if (size === 'handset') {
            if (subscriptions === undefined) {
              this.#scrollSubscription.set(
                window,
                this.applyScrollAnimation(window, offsetCallback),
              );
            }
          } else if (subscriptions) {
            this.disconnectScrollAnimation(window);
          } else {
            this.#scrollSubscription.set(window, undefined);
          }
        }),
      )
      .subscribe();
  }

  public disconnectScrollAnimation(window: Window): void {
    this.#scrollSubscription.get(window)?.unsubscribe();
    this.#scrollSubscription.delete(window);
  }

  public applyScrollAnimation(window: Window, offsetCallback = () => 0): Subscription {
    const scroll$ = this.#scrollService.connectScrollAnimation(window, offsetCallback);

    return combineLatest([
      scroll$.up.pipe(
        tap(() => {
          this.showFab.set(VisibilityState.Visible);
          this.showTopAppBar.set(VisibilityState.Visible);
          this.down.set(false);
          this.up.set(true);
        }),
      ),
      scroll$.down.pipe(
        tap(() => {
          this.showFab.set(VisibilityState.Hidden);
          this.showTopAppBar.set(VisibilityState.Hidden);
          this.up.set(false);
          this.down.set(true);
          this.openFab.set(false);
        }),
      ),
    ]).subscribe();
  }

  public scrollTo(x = 0, y = 0, window?: Window): void {
    const windows: Array<Window> = [...this.#scrollSubscription.keys()];
    (window ?? windows.shift())?.scrollTo({ top: y, left: x });
  }

  public closeSidebar(): void {
    if (this.size() !== 'web') {
      this.openSidebar.set(false);
    }
  }

  public toggleSidebar(value?: boolean): void {
    this.openSidebar.set(value ?? !this.openSidebar());
  }

  #size(initialValue = 'handset'): Observable<string> {
    return this.#breakpointObserver.observe([...this.#displayNameMap.keys()]).pipe(
      map((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            return this.#displayNameMap.get(query) ?? initialValue;
          }
        }

        return initialValue;
      }),
      share(),
      distinctUntilChanged(),
    );
  }

  #isRouteContextChanged(): Signal<boolean> {
    return toSignal(
      this.#router.events.pipe(
        filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd),
        pairwise(),
        map(
          ([pre, post]) =>
            pre.urlAfterRedirects.split('/')[1] !== post.urlAfterRedirects.split('/')[1],
        ),
      ),
      { initialValue: false },
    );
  }

  #isStable(): Signal<boolean> {
    return toSignal(
      this.#router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        // eslint-disable-next-line unicorn/no-null
        first(null, undefined),
        switchMap(async () => new Promise((r) => setTimeout(r))),
        map(() => true),
        startWith(false),
      ),
      { requireSync: true },
    );
  }

  #navigationStart(): Signal<NavigationStart | undefined> {
    return toSignal(this.#router.events.pipe(filter((evt) => evt instanceof NavigationStart)), {
      initialValue: undefined,
    });
  }
}
