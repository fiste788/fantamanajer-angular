import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { Subscription, Observable } from 'rxjs';
import { SharedService } from '@app/shared/services/shared.service';
import { ScrollService } from '@app/core/services/scroll.service';
import { routerTransition, scrollUpAnimation, closeAnimation } from '@app/core/animations';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { map, filter } from 'rxjs/operators';
import { VisibilityState } from './visibility-state';
import { ThemeService } from '@app/core/services/theme.service';
import { LayoutService } from '@app/core/services/layout.service';

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

  private subscriptions: Subscription[] = [];
  public openedSidebar: Observable<boolean>;
  public showedSpeedDial: Observable<VisibilityState>;
  public showedToolbar: Observable<VisibilityState>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private scrollService: ScrollService,
    private themeService: ThemeService,
    private layoutService: LayoutService,
    public media: MediaObserver,
    public shared: SharedService,
    private ngZone: NgZone,
    private changeRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.openedSidebar = this.layoutService.openedSidebar;
    this.showedSpeedDial = this.layoutService.isShowSpeedDial;
    this.showedToolbar = this.layoutService.isShowToolbar;
    if (this.drawer) {
      this.drawer.autoFocus = false;
      this.drawer.openedStart.subscribe(() => {
        this.changeRef.detectChanges();
        this.drawer._animationEnd.subscribe(() => {
          this.layoutService.showSpeedDial();
        });
      });

    }
  }

  ngAfterViewInit() {
    this.layoutService.connect();

    this.ngZone.runOutsideAngular(() => {
      this.layoutService.isHandset$.subscribe((isHandset) => {
        if (isHandset) {
          if (!this.subscriptions.length) {
            const el: HTMLElement = this.toolbarEl.nativeElement.firstChild;
            this.subscriptions = this.applyScrollAnimation(el.clientHeight);
          }
        } else {
          if (this.subscriptions.length) {
            this.subscriptions.forEach((sub) => sub.unsubscribe());
            this.subscriptions = [];
          }
        }
      });
    });
  }

  applyScrollAnimation(offset = 0): Subscription[] {
    this.scrollService.initScrollAnimation(this.container, offset);
    const subs: Subscription[] = [];

    subs.push(this.scrollService.goingUp$.subscribe(() => {
      this.layoutService.showSpeedDial();
      this.layoutService.showToolbar();
      const height = this.document.querySelector('fm-toolbar > .mat-toolbar.mat-primary').clientHeight;
      this.document.querySelectorAll('.sticky, .mat-table-sticky').forEach((e: HTMLElement) => e.style.top = height + 'px');
      this.changeRef.detectChanges();
    }));

    subs.push(this.scrollService.goingDown$.subscribe(() => {
      this.layoutService.hideSpeedDial();
      this.layoutService.hideToolbar();
      this.speedDial.openSpeeddial = false;
      this.document.querySelectorAll('.sticky, .mat-table-sticky').forEach((e: HTMLElement) => e.style.top = '0');
      this.changeRef.detectChanges();
    }));
    return subs;
  }

  scrollTo(x: number = 0, y: number = 0) {
    this.container.scrollTo({ top: y, left: x });
  }

  closeSidenav() {
    if (this.drawer && this.drawer.mode === 'over') {
      this.drawer.close();
    }
  }

  getState(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRouteData.state : 'empty';
  }
}
