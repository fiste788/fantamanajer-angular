/* eslint-disable sort-keys */
import { trigger } from '@angular/animations';
import { DOCUMENT, AsyncPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatSidenav, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { combineLatest, EMPTY, fromEvent, Observable, Subscription, timer } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  share,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { CurrentTransitionService, WINDOW } from '@app/services';
import {
  closeAnimation,
  routerTransition,
  scrollDownAnimation,
  scrollUpAnimation,
} from '@shared/animations';
import { StatePipe } from '@shared/pipes';

import { LayoutService } from '../../services';
import { BottomBarComponent } from '../bottom-bar/bottom-bar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  animations: [
    trigger('contextChange', routerTransition),
    scrollUpAnimation,
    scrollDownAnimation,
    closeAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main',
  styleUrls: ['./main.component.scss'],
  templateUrl: './main.component.html',
  standalone: true,
  imports: [
    MatSidenavModule,
    NavbarComponent,
    ToolbarComponent,
    RouterOutlet,
    SpeedDialComponent,
    BottomBarComponent,
    AsyncPipe,
    StatePipe,
    NgClass,
  ],
})
export class MainComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatSidenav, { static: true }) protected drawer?: MatSidenav;
  @ViewChild(MatSidenavContent) protected container?: MatSidenavContent;
  @ViewChild(SpeedDialComponent) protected speedDial?: SpeedDialComponent;

  protected readonly isReady$: Observable<boolean>;
  protected readonly isOpen$: Observable<boolean>;
  protected readonly isHandset$: Observable<boolean>;
  protected readonly openedSidebar$: Observable<boolean>;
  protected readonly showedSpeedDial$: Observable<VisibilityState>;
  protected readonly showedToolbar$: Observable<VisibilityState>;
  protected isScrolled$?: Observable<boolean>;

  private readonly subscriptions = new Subscription();

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(WINDOW) private readonly window: Window,
    private readonly auth: AuthenticationService,
    private readonly layoutService: LayoutService,
    private readonly ngZone: NgZone,
    private readonly transitionService: CurrentTransitionService,
    private readonly changeRef: ChangeDetectorRef,
  ) {
    this.isReady$ = this.layoutService.isReady$;
    this.isHandset$ = this.layoutService.isHandset$;
    this.openedSidebar$ = this.layoutService.openedSidebar$;
    this.isOpen$ = this.isOpenObservable();
    this.showedSpeedDial$ = this.isShowedSpeedDial();
    this.showedToolbar$ = this.layoutService.isShowToolbar$;
  }

  public ngAfterViewInit(): void {
    this.subscriptions.add(this.preBootstrapExitAnimation().subscribe());
    this.subscriptions.add(this.initDrawer().subscribe());
    this.subscriptions.add(this.layoutService.connectChangePageAnimation());
    if (this.container) {
      this.setupScrollAnimation(this.window);
    }
    this.changeRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected open(open: boolean): void {
    this.layoutService.toggleSidebar(open);
  }

  protected viewTransitionName() {
    return this.transitionService.isRootOutlet() ? 'main' : '';
  }

  private preBootstrapExitAnimation(): Observable<void> {
    return this.isReady$.pipe(
      filter((e) => e),
      tap(() => this.layoutService.showSpeedDial()),
      switchMap(() => timer(300)),
      map(() => this.document.querySelector('.pre-bootstrap')?.remove()),
    );
  }

  private setupScrollAnimation(window: Window): void {
    this.ngZone.runOutsideAngular(() => {
      this.isScrolled$ = fromEvent(window, 'scroll').pipe(
        throttleTime(15),
        map(() => window.scrollY),
        map((y) => y > 48),
        distinctUntilChanged(),
        share(),
      );

      this.layoutService.connectScrollAnimation(
        window,
        this.up.bind(this),
        this.down.bind(this),
        this.getToolbarHeight(),
      );
    });
  }

  private up(): void {
    // this.updateSticky(this.getToolbarHeight());
  }

  private down(): void {
    this.speedDial?.close();
    // this.updateSticky(0);
  }

  private initDrawer(): Observable<void> {
    return (
      this.drawer?.openedStart.pipe(
        mergeMap(() => this.drawer?._animationEnd ?? EMPTY),
        map(() => this.layoutService.setReady()),
      ) ?? EMPTY
    );
  }

  private isOpenObservable(): Observable<boolean> {
    return combineLatest([this.isReady$, this.isHandset$, this.openedSidebar$]).pipe(
      map(([r, h, o]) => o || (!h && r)),
      distinctUntilChanged(),
    );
  }

  private isShowedSpeedDial(): Observable<VisibilityState> {
    return combineLatest([this.layoutService.isShowSpeedDial$, this.auth.loggedIn$]).pipe(
      map(([v, u]) => (u ? v : VisibilityState.Hidden)),
    );
  }

  private getToolbarHeight(): number {
    return this.document.querySelector('app-toolbar')?.clientHeight ?? 0;
  }
}
