import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { VisibilityState } from '@app/layout/main/visibility-state';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScrollService } from './scroll.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  openSidebar$ = new BehaviorSubject<boolean>(false);
  openedSidebar$ = this.openSidebar$.asObservable();
  isReady$ = new BehaviorSubject<boolean>(false);
  private readonly showSpeedDial$ = new BehaviorSubject<boolean>(false);
  private readonly showToolbar$ = new BehaviorSubject<boolean>(true);
  private subscriptions: Array<Subscription> = [];

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly scrollService: ScrollService
  ) {
  }

  connect(): void {
    this.isHandset$.subscribe(e => {
      this.openSidebar$.next(!e);
      this.showSpeedDial$.next(this.showSpeedDial$.value || e);
      this.showToolbar$.next(true);
      this.setReady();
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
    this.openSidebar$.next(true);
  }

  closeSidebar(): void {
    this.openSidebar$.next(false);
  }

  toggleSidebar(): void {
    this.openSidebar$.next(!this.openSidebar$.value);
  }

  showSpeedDial(): void {
    this.showSpeedDial$.next(true);
  }

  hideSpeedDial(): void {
    this.showSpeedDial$.next(false);
  }

  showToolbar(): void {
    this.showToolbar$.next(true);
  }

  hideToolbar(): void {
    this.showToolbar$.next(false);
  }

  setReady(): void {
    this.isReady$.next(true);
  }

  get isShowSpeedDial(): Observable<VisibilityState> {
    return this.showSpeedDial$.pipe(map(s => s ? VisibilityState.Visible : VisibilityState.Hidden));
  }

  get isShowToolbar(): Observable<VisibilityState> {
    return this.showToolbar$.pipe(map(s => s ? VisibilityState.Visible : VisibilityState.Hidden));
  }
}
