import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, tap } from 'rxjs/operators';

import { VisibilityState } from '@app/enums/visibility-state';
import { ScrollService } from '@app/services';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public isHandset$: Observable<boolean>;
  public openedSidebar$: Observable<boolean>;
  public isReady$: Observable<boolean>;
  public isShowSpeedDial$: Observable<VisibilityState>;
  public isShowToolbar$: Observable<VisibilityState>;

  private readonly isReadySubject = new BehaviorSubject<boolean>(false);
  private readonly openSidebarSubject = new BehaviorSubject<boolean>(false);
  private readonly showSpeedDialSubject = new BehaviorSubject<boolean>(false);
  private readonly showToolbarSubject = new BehaviorSubject<boolean>(true);
  private readonly scrollSubscription = new Map<Window, Subscription | undefined>();

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly scrollService: ScrollService,
    private readonly router: Router,
  ) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches));
    this.openedSidebar$ = this.openSidebarSubject.asObservable();
    this.isReady$ = this.isReadySubject.pipe(distinctUntilChanged());
    this.isShowSpeedDial$ = this.showSpeedDialSubject.pipe(
      map((s) => (s ? VisibilityState.Visible : VisibilityState.Hidden)),
    );
    this.isShowToolbar$ = this.showToolbarSubject.pipe(
      map((s) => (s ? VisibilityState.Visible : VisibilityState.Hidden)),
    );
  }

  public init(): Observable<boolean> {
    return this.isHandset$.pipe(
      tap((e) => {
        this.openSidebarSubject.next(!e);
        this.showSpeedDialSubject.next(this.showSpeedDialSubject.value || e);
        this.showToolbarSubject.next(true);
        if (e) {
          this.setReady();
        }
      }),
    );
  }

  public connectChangePageAnimation(): Subscription {
    return this.isRouteContextChanged()
      .pipe(filter((c) => c))
      .subscribe(() => {
        this.showToolbar();
        this.showSpeedDial();
      });
  }

  public connectScrollAnimation(
    window: Window,
    upCallback: () => void,
    downCallback: () => void,
    offset = 0,
  ): Subscription {
    return this.isHandset$
      .pipe(
        tap((isHandset) => {
          const subscriptions = this.scrollSubscription.get(window);
          if (isHandset) {
            if (subscriptions === undefined) {
              this.scrollSubscription.set(
                window,
                this.applyScrollAnimation(window, upCallback, downCallback, offset),
              );
            }
          } else if (subscriptions) {
            this.disconnectScrollAnimation(window);
          } else {
            this.scrollSubscription.set(window, undefined);
          }
        }),
      )
      .subscribe();
  }

  public disconnectScrollAnimation(window: Window): void {
    this.scrollSubscription.get(window)?.unsubscribe();
    this.scrollSubscription.delete(window);
  }

  public applyScrollAnimation(
    window: Window,
    upCallback: () => void,
    downCallback: () => void,
    offset = 0,
  ): Subscription {
    const scroll$ = this.scrollService.connectScrollAnimation(window, offset);

    return combineLatest([
      scroll$.up.pipe(
        tap(() => {
          this.showSpeedDial();
          this.showToolbar();
          upCallback();
        }),
      ),
      scroll$.down.pipe(
        tap(() => {
          this.hideSpeedDial();
          this.hideToolbar();
          downCallback();
        }),
      ),
    ]).subscribe();
  }

  public scrollTo(x = 0, y = 0, window?: Window): void {
    const windows: Array<Window> = [...this.scrollSubscription.keys()];
    (window ?? windows.shift())?.scrollTo({ top: y, left: x });
  }

  public openSidebar(): void {
    this.openSidebarSubject.next(true);
  }

  public closeSidebar(): void {
    this.openSidebarSubject.next(false);
  }

  public toggleSidebar(value?: boolean): void {
    this.openSidebarSubject.next(value ?? !this.openSidebarSubject.value);
  }

  public showSpeedDial(): void {
    this.showSpeedDialSubject.next(true);
  }

  public hideSpeedDial(): void {
    this.showSpeedDialSubject.next(false);
  }

  public showToolbar(): void {
    this.showToolbarSubject.next(true);
  }

  public hideToolbar(): void {
    this.showToolbarSubject.next(false);
  }

  public setReady(): void {
    this.isReadySubject.next(true);
  }

  private isRouteContextChanged(): Observable<boolean> {
    return this.router.events.pipe(
      filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd),
      pairwise(),
      map(
        ([pre, post]) =>
          pre.urlAfterRedirects.split('/')[1] !== post.urlAfterRedirects.split('/')[1],
      ),
    );
  }
}
