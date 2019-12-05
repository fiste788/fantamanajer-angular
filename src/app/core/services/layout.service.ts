import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScrollService } from './scroll.service';
import { VisibilityState } from '@app/shared/layout/main/visibility-state';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));
  public openSidebar$ = new BehaviorSubject<boolean>(false);
  public openedSidebar = this.openSidebar$.asObservable();
  private showSpeedDial$ = new BehaviorSubject<boolean>(false);
  private showToolbar$ = new BehaviorSubject<boolean>(true);
  public isReady$ = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private scrollService: ScrollService
  ) {
  }

  connect() {
    this.isHandset$.subscribe(e => {
      this.openSidebar$.next(!e);
      this.showSpeedDial$.next(this.showSpeedDial$.value || e);
      this.showToolbar$.next(true);
      this.setReady();
    });
  }

  connectScrollAnimation(upCallback: () => void, downCallback: () => void, offset = 0) {
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        if (!this.subscriptions.length) {
          this.subscriptions = this.applyScrollAnimation(upCallback, downCallback, offset);
        }
      } else if (this.subscriptions.length) {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions = [];
      }
    });
  }

  applyScrollAnimation(upCallback: () => void, downCallback: () => void, offset = 0): Subscription[] {
    this.scrollService.connectScrollAnimation(offset);
    const subs: Subscription[] = [];

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

  openSidebar() {
    this.openSidebar$.next(true);
  }

  closeSidebar() {
    this.openSidebar$.next(false);
  }

  toggleSidebar() {
    this.openSidebar$.next(!this.openSidebar$.value);
  }

  showSpeedDial() {
    this.showSpeedDial$.next(true);
  }

  hideSpeedDial() {
    this.showSpeedDial$.next(false);
  }

  showToolbar() {
    this.showToolbar$.next(true);
  }

  hideToolbar() {
    this.showToolbar$.next(false);
  }

  setReady() {
    this.isReady$.next(true);
  }

  get isShowSpeedDial(): Observable<VisibilityState> {
    return this.showSpeedDial$.pipe(map(s => s ? VisibilityState.Visible : VisibilityState.Hidden));
  }

  get isShowToolbar(): Observable<VisibilityState> {
    return this.showToolbar$.pipe(map(s => s ? VisibilityState.Visible : VisibilityState.Hidden));
  }
}
