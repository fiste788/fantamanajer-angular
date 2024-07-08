import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, tap } from 'rxjs/operators';

import { VisibilityState } from '@app/enums/visibility-state';
import { ScrollService } from '@app/services';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #scrollService = inject(ScrollService);
  readonly #router = inject(Router);
  readonly #isReadySubject = new BehaviorSubject<boolean>(false);
  readonly #openSidebarSubject = new BehaviorSubject<boolean>(false);
  readonly #showSpeedDialSubject = new BehaviorSubject<boolean>(false);
  readonly #showToolbarSubject = new BehaviorSubject<boolean>(true);
  readonly #scrollSubscription = new Map<Window, Subscription | undefined>();

  public isHandset$ = this.#breakpointObserver
    .observe(Breakpoints.XSmall)
    .pipe(map((result) => result.matches));

  public isTablet$ = this.#breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.Medium])
    .pipe(map((result) => result.matches));

  public openedSidebar$ = this.#openSidebarSubject.asObservable();
  public isReady$ = this.#isReadySubject.pipe(distinctUntilChanged());
  public isShowSpeedDial$ = this.#showSpeedDialSubject.pipe(
    map((s) => (s ? VisibilityState.Visible : VisibilityState.Hidden)),
  );

  public isShowToolbar$ = this.#showToolbarSubject.pipe(
    map((s) => (s ? VisibilityState.Visible : VisibilityState.Hidden)),
  );

  public readonly up = new BehaviorSubject<boolean>(false);
  public readonly down = new BehaviorSubject<boolean>(false);

  public init(): Observable<boolean> {
    return combineLatest([this.isHandset$, this.isTablet$]).pipe(
      map(([h, t]) => {
        this.#openSidebarSubject.next(!h && !t);
        this.#showSpeedDialSubject.next(this.#showSpeedDialSubject.value || h);
        this.#showToolbarSubject.next(true);
        if (h) {
          this.setReady();
        }

        return true;
      }),
    );
  }

  public connectChangePageAnimation(): Subscription {
    return this.#isRouteContextChanged()
      .pipe(filter((c) => c))
      .subscribe(() => {
        this.showToolbar();
        this.showSpeedDial();
      });
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
          this.showSpeedDial();
          this.showToolbar();
          this.up.next(true);
        }),
      ),
      scroll$.down.pipe(
        tap(() => {
          this.hideSpeedDial();
          this.hideToolbar();
          this.down.next(true);
        }),
      ),
    ]).subscribe();
  }

  public scrollTo(x = 0, y = 0, window?: Window): void {
    const windows: Array<Window> = [...this.#scrollSubscription.keys()];
    (window ?? windows.shift())?.scrollTo({ top: y, left: x });
  }

  public openSidebar(): void {
    this.#openSidebarSubject.next(true);
  }

  public closeSidebar(): void {
    this.#openSidebarSubject.next(false);
  }

  public toggleSidebar(value?: boolean): void {
    this.#openSidebarSubject.next(value ?? !this.#openSidebarSubject.value);
  }

  public showSpeedDial(): void {
    this.#showSpeedDialSubject.next(true);
  }

  public hideSpeedDial(): void {
    this.#showSpeedDialSubject.next(false);
  }

  public showToolbar(): void {
    this.#showToolbarSubject.next(true);
  }

  public hideToolbar(): void {
    this.#showToolbarSubject.next(false);
  }

  public setReady(): void {
    this.#isReadySubject.next(true);
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
