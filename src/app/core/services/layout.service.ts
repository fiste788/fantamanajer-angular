import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

import { VisibilityState } from '@app/enums/visibility-state';

import { ScrollService } from './scroll.service';
import { MatSidenavContent } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public isHandset$: Observable<boolean>;
  public openSidebarSubject = new BehaviorSubject<boolean>(false);
  public openedSidebar$: Observable<boolean>;
  public isReadySubject = new BehaviorSubject<boolean>(false);
  public isReady$: Observable<boolean>;
  public isShowSpeedDial$: Observable<VisibilityState>;
  public isShowToolbar$: Observable<VisibilityState>;

  private readonly showSpeedDialSubject = new BehaviorSubject<boolean>(false);
  private readonly showToolbarSubject = new BehaviorSubject<boolean>(true);
  private readonly subscriptions: Array<Subscription> = [];
  private readonly scrollSubscription = new Map<MatSidenavContent, Array<Subscription>>();

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly scrollService: ScrollService,
  ) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches));
    this.openedSidebar$ = this.openSidebarSubject.asObservable();
    this.isReady$ = this.isReadySubject.asObservable().pipe(distinctUntilChanged());
    this.isShowSpeedDial$ = this.showSpeedDialSubject
      .asObservable()
      .pipe(map((s) => (s ? VisibilityState.Visible : VisibilityState.Hidden)));
    this.isShowToolbar$ = this.showToolbarSubject
      .asObservable()
      .pipe(map((s) => (s ? VisibilityState.Visible : VisibilityState.Hidden)));
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

  public connectScrollAnimation(
    container: MatSidenavContent,
    upCallback: () => void,
    downCallback: () => void,
    offset = 0,
  ): void {
    this.subscriptions.push(
      this.isHandset$
        .pipe(
          tap((isHandset) => {
            const subscriptions = this.scrollSubscription.get(container);
            if (isHandset) {
              if (!subscriptions?.length) {
                this.scrollSubscription.set(
                  container,
                  this.applyScrollAnimation(container, upCallback, downCallback, offset),
                );
              }
            } else if (subscriptions?.length) {
              subscriptions.forEach((sub) => {
                sub.unsubscribe();
              });
              this.scrollSubscription.delete(container);
            } else {
              this.scrollSubscription.set(container, []);
            }
          }),
        )
        .subscribe(),
    );
  }

  public disconnectScrollAnimation(container: MatSidenavContent): void {
    this.scrollSubscription.get(container)?.forEach((sub) => {
      sub.unsubscribe();
    });
    this.scrollSubscription.delete(container);
  }

  public applyScrollAnimation(
    container: MatSidenavContent,
    upCallback: () => void,
    downCallback: () => void,
    offset = 0,
  ): Array<Subscription> {
    const obs = this.scrollService.connectScrollAnimation(container, offset);
    const subs: Array<Subscription> = [];

    subs.push(
      obs.up.subscribe(() => {
        this.showSpeedDial();
        this.showToolbar();
        upCallback();
      }),
      obs.down.subscribe(() => {
        this.hideSpeedDial();
        this.hideToolbar();
        downCallback();
      }),
    );

    return subs;
  }

  public scrollTo(x = 0, y = 0, container?: MatSidenavContent): void {
    const containers: Array<MatSidenavContent> = [...this.scrollSubscription.keys()];
    (container || containers.shift())?.scrollTo({ top: y, left: x });
  }

  public openSidebar(): void {
    this.openSidebarSubject.next(true);
  }

  public closeSidebar(): void {
    this.openSidebarSubject.next(false);
  }

  public toggleSidebar(): void {
    this.openSidebarSubject.next(!this.openSidebarSubject.value);
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
}
