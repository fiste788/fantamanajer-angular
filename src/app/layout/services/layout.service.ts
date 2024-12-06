import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  combineLatest,
  Observable,
  of,
  Subscription,
  filter,
  map,
  pairwise,
  tap,
  switchMap,
  startWith,
  first,
} from 'rxjs';

import { VisibilityState } from '@app/enums/visibility-state';
import { ScrollService } from '@app/services';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #scrollService = inject(ScrollService);
  readonly #router = inject(Router);
  readonly #platform = inject(PLATFORM_ID);
  readonly #scrollSubscription = new Map<Window, Subscription | undefined>();

  public readonly openSidebar = signal(false);
  public readonly showSpeedDial = signal(false);
  public readonly showToolbar = signal(false);
  public readonly up = signal(false);
  public readonly down = signal(false);

  public readonly isHandset$ = isPlatformServer(this.#platform)
    ? of(true)
    : this.#breakpointObserver.observe(Breakpoints.XSmall).pipe(map((result) => result.matches));

  public readonly isTablet$ = this.#breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.Medium])
    .pipe(map((result) => result.matches));

  public readonly isDesktop = toSignal(
    combineLatest([this.isHandset$, this.isTablet$]).pipe(map(([h, t]) => !h && !t)),
  );

  public readonly isShowSpeedDial$ = toObservable(this.showSpeedDial).pipe(
    map((s) => (s ? VisibilityState.Visible : VisibilityState.Hidden)),
  );

  public readonly isShowToolbar$ = toObservable(this.showToolbar).pipe(
    map((s) => (s ? VisibilityState.Visible : VisibilityState.Hidden)),
  );

  public stable = toSignal(
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

  public init(): Observable<boolean> {
    return combineLatest([this.isHandset$, this.isTablet$]).pipe(
      map(([h, t]) => {
        this.openSidebar.set(!h && !t);
        this.showSpeedDial.set(this.showSpeedDial() || h);
        this.showToolbar.set(true);

        return true;
      }),
    );
  }

  public connectChangePageAnimation(): Subscription {
    return this.#isRouteContextChanged()
      .pipe(
        filter((c) => c),
        tap(() => {
          this.showToolbar();
          this.showSpeedDial();
        }),
      )
      .subscribe();
  }

  public connectScrollAnimation(window: Window, offsetCallback = () => 0): Subscription {
    return this.isHandset$
      .pipe(
        tap((isHandset) => {
          const subscriptions = this.#scrollSubscription.get(window);
          if (isHandset) {
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
          this.showSpeedDial.set(true);
          this.showToolbar.set(true);
          this.up.set(true);
        }),
      ),
      scroll$.down.pipe(
        tap(() => {
          this.showSpeedDial.set(false);
          this.showToolbar.set(false);
          this.down.set(true);
        }),
      ),
    ]).subscribe();
  }

  public scrollTo(x = 0, y = 0, window?: Window): void {
    const windows: Array<Window> = [...this.#scrollSubscription.keys()];
    (window ?? windows.shift())?.scrollTo({ top: y, left: x });
  }

  public closeSidebar(): void {
    if (!this.isDesktop()) {
      this.openSidebar.set(false);
    }
  }

  public toggleSidebar(value?: boolean): void {
    this.openSidebar.set(value ?? !this.openSidebar());
  }

  #isRouteContextChanged(): Observable<boolean> {
    return this.#router.events.pipe(
      filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd),
      pairwise(),
      map(
        ([pre, post]) =>
          pre.urlAfterRedirects.split('/')[1] !== post.urlAfterRedirects.split('/')[1],
      ),
    );
  }
}
