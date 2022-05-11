import { trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { combineLatest, EMPTY, Observable, Subscription, timer } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import {
  ApplicationService,
  GoogleAnalyticsService,
  LayoutService,
  PushService,
  PwaService,
  ThemeService,
} from '@app/services';
import { environment } from '@env';
import { closeAnimation, routerTransition, scrollUpAnimation } from '@shared/animations';
import { BreadcrumbService } from '@shared/components/breadcrumb/breadcrumb.service';

import { SpeedDialComponent } from '../speed-dial/speed-dial.component';

@Component({
  animations: [trigger('contextChange', routerTransition), scrollUpAnimation, closeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main',
  styleUrls: ['./main.component.scss'],
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSidenav, { static: true }) public drawer?: MatSidenav;
  @ViewChild(MatSidenavContent) public container?: MatSidenavContent;
  @ViewChild(SpeedDialComponent) public speedDial?: SpeedDialComponent;

  public isReady$: Observable<boolean>;
  public isOpen$: Observable<boolean>;
  public isHandset$: Observable<boolean>;
  public openedSidebar$: Observable<boolean>;
  public showedSpeedDial$: Observable<VisibilityState>;
  public showedToolbar$: Observable<VisibilityState>;

  private readonly subscriptions = new Subscription();

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly app: ApplicationService,
    private readonly pwa: PwaService,
    private readonly push: PushService,
    private readonly breadcrumb: BreadcrumbService,
    private readonly auth: AuthenticationService,
    private readonly layoutService: LayoutService,
    private readonly themeService: ThemeService,
    private readonly ngZone: NgZone,
    private readonly gaService: GoogleAnalyticsService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly appRef: ApplicationRef,
  ) {
    this.isReady$ = this.layoutService.isReady$;
    this.isHandset$ = this.layoutService.isHandset$;
    this.openedSidebar$ = this.layoutService.openedSidebar$;
    this.isOpen$ = this.isOpenObservable();
    this.showedSpeedDial$ = combineLatest([
      this.layoutService.isShowSpeedDial$,
      this.auth.loggedIn$,
    ]).pipe(map(([v, u]) => (u ? v : VisibilityState.Hidden)));
    this.showedToolbar$ = this.layoutService.isShowToolbar$;
  }

  public ngOnInit(): void {
    this.subscriptions.add(this.app.connect(this.appRef));
    this.subscriptions.add(this.breadcrumb.connect('FantaManajer'));
    this.subscriptions.add(this.pwa.connect());
    this.subscriptions.add(this.push.connect());
    this.subscriptions.add(this.themeService.connect());
    this.subscriptions.add(this.preBootstrapExitAnimation().subscribe());
  }

  public ngAfterViewInit(): void {
    this.subscriptions.add(this.layoutService.init().subscribe());
    this.subscriptions.add(this.initDrawer().subscribe());
    if (this.container) {
      this.setupScrollAnimation(this.container);
    }
    this.changeRef.detectChanges();
  }

  public preBootstrapExitAnimation(): Observable<void> {
    return this.isReady$.pipe(
      filter((e) => e),
      tap(() => this.layoutService.showSpeedDial()),
      switchMap(() => timer(300)),
      tap(() => this.document.querySelector('.pre-bootstrap')?.remove()),
      switchMap(() => this.gaService.init(environment.gaCode)),
    );
  }

  public open(open: boolean): void {
    this.layoutService.openSidebarSubject.next(open);
  }

  public setupScrollAnimation(container: MatSidenavContent): void {
    this.ngZone.runOutsideAngular(() => {
      this.layoutService.connectScrollAnimation(
        container,
        this.up.bind(this),
        this.up.bind(this),
        this.getToolbarHeight(),
      );
    });
  }

  public up(): void {
    this.updateSticky(this.getToolbarHeight());
  }

  public down(): void {
    if (this.speedDial) {
      this.speedDial.openSpeeddial = false;
    }
    this.updateSticky(0);
  }

  public initDrawer(): Observable<void> {
    return this.drawer
      ? this.drawer.openedStart.pipe(
          mergeMap(() => this.drawer?._animationEnd ?? EMPTY),
          map(() => this.layoutService.setReady()),
        )
      : EMPTY;
  }

  public isOpenObservable(): Observable<boolean> {
    return combineLatest([this.isReady$, this.isHandset$, this.openedSidebar$]).pipe(
      map(([r, h, o]) => o || (!h && r)),
      distinctUntilChanged(),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateSticky(offset: number): void {
    this.document.querySelectorAll('.sticky').forEach((e: Element) => {
      if (e instanceof HTMLElement) {
        e.style.top = `${offset}px`;
      }
    });
    this.changeRef.detectChanges();
  }

  private getToolbarHeight(): number {
    const toolbar = this.document.querySelector('app-toolbar > .mat-toolbar.mat-primary');
    return toolbar?.clientHeight ?? 0;
  }
}
