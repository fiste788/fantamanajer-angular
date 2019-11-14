import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { Subscription, Observable } from 'rxjs';
import { SharedService } from '@app/shared/services/shared.service';
import { routerTransition, scrollUpAnimation, closeAnimation } from '@app/core/animations';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, throttleTime, pairwise, distinctUntilChanged, share, filter } from 'rxjs/operators';
import { VisibilityState } from './visibility-state';
import { DOCUMENT } from '@angular/common';

enum Direction {
  Up = 'Up',
  Down = 'Down'
}

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
  @ViewChild('pan', { static: true, read: ElementRef }) panEl: ElementRef;
  public scrollDirection = '';
  private subscriptions: Subscription[] = [];
  public isVisible = false;
  public isVisibleToolbar = true;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));
  isDark$: Observable<boolean> = this.breakpointObserver.observe('(prefers-color-scheme: dark)').pipe(map(result => result.matches));

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private breakpointObserver: BreakpointObserver,
    public media: MediaObserver,
    public shared: SharedService,
    private ngZone: NgZone,
    private changeRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.isDark$.subscribe(dark => this.setTheme(dark));
    if (this.drawer) {
      this.drawer.openedStart.subscribe(() => {
        this.changeRef.detectChanges();
        this.drawer._animationEnd.subscribe(() => {
          this.isVisible = true;
        });
      });

    }
    this.closeSidenav();
  }

  setTheme(isDark: boolean) {
    this.loadStyle((isDark ? 'dark' : 'light') + '-theme.css');
  }

  loadStyle(styleName?: string) {
    const head = this.document.getElementsByTagName('head')[0];

    const themeLink = this.document.getElementById('client-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }

  ngAfterViewInit() {
    this.toolbar.clickToggleNav.subscribe(() => this.drawer.toggle());
    this.isVisible = this.drawer.mode === 'over';
    this.ngZone.runOutsideAngular(() => {
      this.isHandset$.subscribe((res) => {
        if (res) {
          if (!this.subscriptions.length) {
            const el: HTMLElement = this.toolbarEl.nativeElement.firstChild;
            this.subscriptions = this.applyScrollAnimation(el.clientHeight);
          }
        } else {
          // this.isVisible = true;
          this.scrollDirection = Direction.Up.toLowerCase();
          if (this.subscriptions.length) {
            this.subscriptions.forEach((sub) => sub.unsubscribe());
            this.subscriptions = [];
          }
        }
      });
    });
  }

  get toggle(): VisibilityState {
    return this.isVisible ? VisibilityState.Visible : VisibilityState.Hidden;
  }

  get toggleToolbar(): VisibilityState {
    return this.isVisibleToolbar ? VisibilityState.Visible : VisibilityState.Hidden;
  }

  applyScrollAnimation(offset = 0): Subscription[] {
    const subs: Subscription[] = [];
    const scroll$ = this.container.elementScrolled().pipe(
      throttleTime(10),
      map(() => this.container.measureScrollOffset('top')),
      filter((y) => y > offset),
      pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share()

    );

    const goingUp$ = scroll$.pipe(
      filter(direction => direction === Direction.Up)
    );

    const goingDown$ = scroll$.pipe(
      filter(direction => direction === Direction.Down)
    );

    subs.push(goingUp$.subscribe(() => {
      this.scrollDirection = Direction.Up.toLowerCase();
      this.isVisible = true;
      this.isVisibleToolbar = true;
      const height = this.document.querySelector('fm-toolbar > .mat-toolbar.mat-primary').clientHeight;
      this.document.querySelectorAll('.sticky, .mat-table-sticky').forEach((e: HTMLElement) => e.style.top = height + 'px');
      this.changeRef.detectChanges();
    }));

    subs.push(goingDown$.subscribe(() => {
      this.scrollDirection = Direction.Down.toLowerCase();
      this.isVisible = false;
      this.isVisibleToolbar = false;
      this.speedDial.openSpeeddial = false;
      this.document.querySelectorAll('.sticky, .mat-table-sticky').forEach((e: HTMLElement) => e.style.top = '0');
      this.changeRef.detectChanges();
    }));
    return subs;
  }

  scrollTo(x: number = 0, y: number = 0) {
    // if (this.container.measureScrollOffset('top') === 0) {
    this.container.scrollTo({ top: y, left: x });
    // }

  }

  closeSidenav() {
    if (this.drawer && this.drawer.mode === 'over') {
      this.drawer.autoFocus = false;
      this.drawer.close();
    }
  }

  getState(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRouteData.state : 'empty';
  }
}
