import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, Signal, inject, signal, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, map, pairwise, switchMap, startWith, first, distinctUntilChanged } from 'rxjs';

import { Direction } from '@app/enums';
import { VisibilityState } from '@app/enums/visibility-state';
import { ScrollService } from '@app/services';

type NavigationMode = 'bar' | 'rail' | 'drawer';

// #navigationModeMap is now a constant outside the class
const NAVIGATION_MODE_MAP = new Map<string, NavigationMode>([
  [Breakpoints.XSmall, 'bar'],
  [Breakpoints.Small, 'rail'],
  [Breakpoints.Medium, 'rail'],
  [Breakpoints.Large, 'drawer'],
  [Breakpoints.XLarge, 'drawer'],
]);

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #scrollService = inject(ScrollService);
  readonly #router = inject(Router);

  public readonly navigationMode = this.#getNavigationMode(); // Renamed method for clarity

  public readonly openDrawer = linkedSignal(() => {
    const navigationMode = this.navigationMode();
    this.navigationStart();

    return navigationMode === 'drawer';
  });

  public readonly showBars = linkedSignal(() => {
    const navigationMode = this.navigationMode();
    const direction = this.#scrollService.direction();
    const isRouteChanged = this.routeContextChanged();

    // Gestisce la logica precedentemente nell'effect
    if (navigationMode === 'bar' && isRouteChanged) {
      return VisibilityState.Visible;
    }

    return navigationMode !== 'bar' || direction === Direction.Up
      ? VisibilityState.Visible
      : VisibilityState.Hidden;
  });

  public readonly openFab = linkedSignal(() => {
    const navigationMode = this.navigationMode();
    const direction = this.#scrollService.direction();

    // Gestisce la logica precedentemente nell'effect
    if (navigationMode === 'bar' && direction === Direction.Down) {
      return false;
    }

    return false;
  });
  public readonly routeContextChanged = this.#isRouteContextChanged();
  public readonly navigationStart = this.#getNavigationStart(); // Renamed method for clarity
  public readonly skeletonColors = signal({
    foreground: '#ffd9df',
    background: '#ffb1c1',
  });
  public stable = this.#isStable();

  public closeDrawer(): void {
    if (this.navigationMode() !== 'drawer') {
      this.openDrawer.set(false);
    }
  }

  public toggleDrawer(value?: boolean): void {
    this.openDrawer.set(value ?? !this.openDrawer());
  }

  // Renamed method for clarity
  #getNavigationMode(initialValue: NavigationMode = 'bar'): Signal<NavigationMode> {
    return toSignal(
      this.#breakpointObserver.observe([...NAVIGATION_MODE_MAP.keys()]).pipe(
        map((result) => {
          for (const query of Object.keys(result.breakpoints)) {
            if (result.breakpoints[query]) {
              return NAVIGATION_MODE_MAP.get(query) ?? initialValue;
            }
          }

          return initialValue;
        }),
        distinctUntilChanged(),
      ),
      { requireSync: true },
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

  // Renamed method for clarity
  #getNavigationStart(): Signal<NavigationStart | undefined> {
    return toSignal(this.#router.events.pipe(filter((evt) => evt instanceof NavigationStart)), {
      initialValue: undefined,
    });
  }
}
