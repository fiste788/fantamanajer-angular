import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, Signal, effect, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import {
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
  merge,
} from 'rxjs';

import { Direction } from '@app/enums';
import { VisibilityState } from '@app/enums/visibility-state';
import { filterNavigationMode } from '@app/functions';
import { ScrollService } from '@app/services';

type NavigationMode = 'bar' | 'rail' | 'drawer';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #scrollService = inject(ScrollService);
  readonly #router = inject(Router);
  readonly #navigationModeMap = new Map<string, NavigationMode>([
    [Breakpoints.XSmall, 'bar'],
    [Breakpoints.Small, 'rail'],
    [Breakpoints.Medium, 'rail'],
    [Breakpoints.Large, 'drawer'],
    [Breakpoints.XLarge, 'drawer'],
  ]);
  readonly #navigationMode$ = this.#navigationMode();

  public readonly navigationMode = toSignal(this.#navigationMode$, { initialValue: 'bar' });
  public readonly openDrawer = linkedSignal(() => this.navigationMode() === 'drawer');
  public readonly showFab = linkedSignal(() =>
    this.navigationMode() === 'bar' || this.routeContextChanged()
      ? VisibilityState.Visible
      : VisibilityState.Hidden,
  );
  public readonly showTopAppBar = linkedSignal(() =>
    this.navigationMode().length > 0 || this.routeContextChanged()
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
    effect(() => this.navigationStart() !== undefined && this.closeDrawer());
  }

  public connectScrollAnimation(window: Window, offsetCallback = () => 0): Subscription {
    const scroll$ = this.#scrollService.connectScrollAnimation(window, offsetCallback);

    return merge(
      scroll$.up.pipe(
        filterNavigationMode<Direction>(this.#navigationMode$),
        tap(() => {
          this.showFab.set(VisibilityState.Visible);
          this.showTopAppBar.set(VisibilityState.Visible);
          this.down.set(false);
          this.up.set(true);
        }),
      ),
      scroll$.down.pipe(
        filterNavigationMode<Direction>(this.#navigationMode$),
        tap(() => {
          this.showFab.set(VisibilityState.Hidden);
          this.showTopAppBar.set(VisibilityState.Hidden);
          this.up.set(false);
          this.down.set(true);
          this.openFab.set(false);
        }),
      ),
    ).subscribe();
  }

  public scrollTo(x = 0, y = 0, window?: Window): void {
    window?.scrollTo({ top: y, left: x });
  }

  public closeDrawer(): void {
    if (this.navigationMode() !== 'drawer') {
      this.openDrawer.set(false);
    }
  }

  public toggleDrawer(value?: boolean): void {
    this.openDrawer.set(value ?? !this.openDrawer());
  }

  #navigationMode(initialValue: NavigationMode = 'bar'): Observable<NavigationMode> {
    return this.#breakpointObserver.observe([...this.#navigationModeMap.keys()]).pipe(
      map((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            return this.#navigationModeMap.get(query) ?? initialValue;
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
