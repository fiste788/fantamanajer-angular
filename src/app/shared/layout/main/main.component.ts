import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { closeAnimation, routerTransition, scrollUpAnimation } from '@app/core/animations';
import { AuthService, LayoutService, ScrollService, ThemeService } from '@app/core/services';
import { combineLatest, forkJoin, Observable, zip } from 'rxjs';
import { combineAll, map, mergeMap } from 'rxjs/operators';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { VisibilityState } from './visibility-state';

@Component({
  selector: 'fm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    routerTransition,
    scrollUpAnimation,
    closeAnimation
  ]
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav, { static: true }) drawer: MatSidenav;
  @ViewChild(MatSidenavContent) container: MatSidenavContent;
  @ViewChild(SpeedDialComponent) speedDial: SpeedDialComponent;
  @ViewChild(ToolbarComponent) toolbar: ToolbarComponent;
  @ViewChild('toolbar', { read: ElementRef }) toolbarEl: ElementRef;

  loggedIn$: Observable<boolean>;
  isReady$: Observable<boolean>;
  isHandset$: Observable<boolean>;
  openedSidebar$: Observable<boolean>;
  showedSpeedDial$: Observable<VisibilityState>;
  showedToolbar$: Observable<VisibilityState>;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly scrollService: ScrollService,
    private readonly themeService: ThemeService,
    private readonly auth: AuthService,
    private readonly layoutService: LayoutService,
    private readonly ngZone: NgZone,
    private readonly changeRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.themeService.connect();
    this.isReady$ = this.layoutService.isReady$;
    this.isHandset$ = this.layoutService.isHandset$;
    this.openedSidebar$ = this.layoutService.openedSidebar;
    this.showedSpeedDial$ = combineLatest(this.layoutService.isShowSpeedDial, this.auth.userChange$)
      .pipe(map(([v, u]) => u === undefined ? VisibilityState.Hidden : v));
    this.showedToolbar$ = this.layoutService.isShowToolbar;
    this.drawer.openedChange.asObservable()
      .subscribe(a => {
        this.layoutService.openSidebar$.next(a);
      });
    this.loggedIn$ = this.auth.userChange$.pipe(map(u => u !== null));
  }

  ngAfterViewInit(): void {
    this.layoutService.connect();
    this.scrollService.connect(this.container);
    this.ngZone.runOutsideAngular(() => {
      this.layoutService.connectScrollAnimation(
        () => {
          const toolbar = this.document.querySelector('fm-toolbar > .mat-toolbar.mat-primary');
          const height = toolbar !== null ? toolbar.clientHeight : 0;
          this.document.querySelectorAll('.sticky')
            .forEach((e: HTMLElement) => e.style.top = `${height}px`);
          this.changeRef.detectChanges();
        },
        () => {
          this.speedDial.openSpeeddial = false;
          this.document.querySelectorAll('.sticky')
            .forEach((e: HTMLElement) => e.style.top = '0');
          this.changeRef.detectChanges();
        },
        this.toolbarEl.nativeElement.firstChild.clientHeight);
    });
    this.initDrawer();
    this.changeRef.detectChanges();
  }

  initDrawer(): void {
    if (this.drawer !== undefined) {
      this.drawer.autoFocus = false;
      this.drawer.openedStart.pipe(mergeMap(() => this.drawer._animationEnd))
        .subscribe(() => {
          this.layoutService.showSpeedDial();
          this.layoutService.setReady();
          setTimeout(() => this.document.querySelector('.pre-bootstrap')
            ?.remove(), 500);
        });
    }
  }

  get isOpen(): Observable<boolean> {
    return combineLatest([this.isReady$, this.isHandset$, this.openedSidebar$])
      .pipe(
        map(([r, h, o]) => (!h && r) || o)
      );
  }

  getState(outlet: RouterOutlet): string {
    return outlet.isActivated ? outlet.activatedRouteData.state : 'empty';
  }
}
