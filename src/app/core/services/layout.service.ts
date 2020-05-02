import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { VisibilityState } from '@app/layout/main/visibility-state';

import { ScrollService } from './scroll.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  openSidebarSubject = new BehaviorSubject<boolean>(false);
  openedSidebar$ = this.openSidebarSubject.asObservable();
  isReadySubject = new BehaviorSubject<boolean>(false);
  isReady$ = this.isReadySubject.asObservable()
    .pipe(distinctUntilChanged());

  private readonly showSpeedDialSubject = new BehaviorSubject<boolean>(false);
  private readonly showToolbarSubject = new BehaviorSubject<boolean>(true);
  private subscriptions: Array<Subscription> = [];

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly scrollService: ScrollService
  ) {
  }

  connect(): void {
    this.isHandset$.subscribe(e => {
      this.openSidebarSubject.next(!e);
      this.showSpeedDialSubject.next(this.showSpeedDialSubject.value || e);
      this.showToolbarSubject.next(true);
      if (e) {
        this.setReady();
      }
    });
  }

  connectScrollAnimation(upCallback: () => void, downCallback: () => void, offset = 0): void {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        if (!this.subscriptions.length) {
          this.subscriptions = this.applyScrollAnimation(upCallback, downCallback, offset);
        }
      } else if (this.subscriptions.length) {
        this.subscriptions.forEach(sub => {
          sub.unsubscribe();
        });
        this.subscriptions = [];
      }
    });
  }

  applyScrollAnimation(upCallback: () => void, downCallback: () => void, offset = 0): Array<Subscription> {
    this.scrollService.connectScrollAnimation(offset);
    const subs: Array<Subscription> = [];

    subs.push(this.scrollService.goingUp$.subscribe(() => {
      this.showSpeedDial();
      this.showToolbar();
      upCallback();
    }));

    subs.push(this.scrollService.goingDown$.subscribe(() => {
      this.hideSpeedDial();
      this.hideToolbar();
      downCallback();
    }));

    return subs;
  }

  openSidebar(): void {
    this.openSidebarSubject.next(true);
  }

  closeSidebar(): void {
    this.openSidebarSubject.next(false);
  }

  toggleSidebar(): void {
    this.openSidebarSubject.next(!this.openSidebarSubject.value);
  }

  showSpeedDial(): void {
    this.showSpeedDialSubject.next(true);
  }

  hideSpeedDial(): void {
    this.showSpeedDialSubject.next(false);
  }

  showToolbar(): void {
    this.showToolbarSubject.next(true);
  }

  hideToolbar(): void {
    this.showToolbarSubject.next(false);
  }

  setReady(): void {
    this.isReadySubject.next(true);
  }

  get isShowSpeedDial(): Observable<VisibilityState> {
    return this.showSpeedDialSubject.pipe(map(s => s ? VisibilityState.Visible : VisibilityState.Hidden));
  }

  get isShowToolbar(): Observable<VisibilityState> {
    return this.showToolbarSubject.pipe(map(s => s ? VisibilityState.Visible : VisibilityState.Hidden));
  }
}
