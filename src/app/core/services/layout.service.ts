import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ThemeService } from './theme.service';
import { ScrollService } from './scroll.service';
import { MediaObserver } from '@angular/flex-layout';
import { VisibilityState } from '@app/shared/layout/main/visibility-state';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));
  private openSidebar$ = new BehaviorSubject<boolean>(false);
  public openedSidebar = this.openSidebar$.asObservable();
  private showSpeedDial$ = new BehaviorSubject<boolean>(false);
  private showToolbar$ = new BehaviorSubject<boolean>(true);

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
  }

  connect() {
    this.isHandset$.subscribe(e => {
      this.openSidebar$.next(!e)
      this.showSpeedDial$.next(e);
    });
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

  get isShowSpeedDial(): Observable<VisibilityState> {
    return this.showSpeedDial$.pipe(map(s => s ? VisibilityState.Visible : VisibilityState.Hidden));
  }

  get isShowToolbar(): Observable<VisibilityState> {
    return this.showToolbar$.pipe(map(s => s ? VisibilityState.Visible : VisibilityState.Hidden));
  }
}
