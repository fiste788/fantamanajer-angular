import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { Subscription, Observable } from 'rxjs';
import * as Hammer from 'hammerjs';
import { SharedService } from '@app/shared/services/shared.service';
import { routerTransition, scrollUpAnimation, closeAnimation } from '@app/core/animations';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
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
  @ViewChild(MatSidenavContent, { static: false }) container: MatSidenavContent;
  @ViewChild(SpeedDialComponent, { static: false }) speedDial: SpeedDialComponent;
  @ViewChild(ToolbarComponent, { static: false }) toolbar: ToolbarComponent;
  @ViewChild('toolbar', { static: false, read: ElementRef }) toolbarEl: ElementRef;
  @ViewChild('pan', { static: true, read: ElementRef }) panEl: ElementRef;
  public scrollDirection = '';
  private mediaQueryList: MediaQueryList;
  private subscriptions: Subscription[] = [];
  public isVisible = true;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private breakpointObserver: BreakpointObserver,
    public media: MediaObserver,
    public shared: SharedService,
    private ngZone: NgZone,
    private changeRef: ChangeDetectorRef,
    private mediaMatcher: MediaMatcher
  ) {
    this.mediaQueryList = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQueryList.addEventListener('change', (e) => this.setTheme(e.matches));
  }

  ngOnInit() {
    this.setTheme(this.mediaQueryList.matches);
    if (this.drawer) {
      this.drawer.openedStart.subscribe(() => this.changeRef.detectChanges());
    }
    this.closeSidenav();
    this.applySwipeSidenav();
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

  applySwipeSidenav() {
    const hammertime = new Hammer(this.panEl.nativeElement, {});
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    hammertime.on('panright', (ev) => {
      this.drawer.open();
      this.changeRef.detectChanges();
    });
    hammertime.on('panleft', (ev) => {
      this.drawer.close();
      this.changeRef.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.isHandset$.subscribe((res) => {
        if (res) {
          if (!this.subscriptions.length) {
            const el: HTMLElement = this.toolbarEl.nativeElement;
            this.subscriptions = this.applyScrollAnimation(el.clientHeight);
          }
        } else {
          this.isVisible = true;
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

  applyScrollAnimation(offset = 0): Subscription[] {
    const subs: Subscription[] = [];
    const scroll$ = this.container.elementScrolled().pipe(
      throttleTime(10),
      map(() => this.container.measureScrollOffset('top')),
      filter((y) => y >= offset),
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
      this.changeRef.detectChanges();
    }));

    subs.push(goingDown$.subscribe(() => {
      this.scrollDirection = Direction.Down.toLowerCase();
      this.isVisible = false;
      this.speedDial.openSpeeddial = false;
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
