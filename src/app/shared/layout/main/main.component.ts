import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { ScrollService } from '@app/core/services/scroll.service';
import { routerTransition, scrollUpAnimation, closeAnimation } from '@app/core/animations';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { VisibilityState } from './visibility-state';
import { ThemeService } from '@app/core/services/theme.service';
import { LayoutService } from '@app/core/services/layout.service';
import { mergeMap, map } from 'rxjs/operators';

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

  public isReady: Observable<boolean>;
  public isHandset$: Observable<boolean>;
  public openedSidebar$: Observable<boolean>;
  public showedSpeedDial$: Observable<VisibilityState>;
  public showedToolbar$: Observable<VisibilityState>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private scrollService: ScrollService,
    private themeService: ThemeService,
    private layoutService: LayoutService,
    private ngZone: NgZone,
    private changeRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.themeService.connect();
    this.isReady = this.layoutService.isReady$;
    this.isHandset$ = this.layoutService.isHandset$;
    this.openedSidebar$ = this.layoutService.openedSidebar;
    this.showedSpeedDial$ = this.layoutService.isShowSpeedDial;
    this.showedToolbar$ = this.layoutService.isShowToolbar;
    this.drawer.openedChange.asObservable().subscribe(a => this.layoutService.openSidebar$.next(a));
  }

  ngAfterViewInit() {
    this.layoutService.connect();
    this.scrollService.connect(this.container);
    this.ngZone.runOutsideAngular(() => {
      this.layoutService.connectScrollAnimation(
        () => {
          const toolbar = this.document.querySelector('fm-toolbar > .mat-toolbar.mat-primary');
          const height = toolbar ? toolbar.clientHeight : 0;
          this.document.querySelectorAll('.sticky').forEach((e: HTMLElement) => e.style.top = height + 'px');
          this.changeRef.detectChanges();
        },
        () => {
          this.speedDial.openSpeeddial = false;
          this.document.querySelectorAll('.sticky').forEach((e: HTMLElement) => e.style.top = '0');
          this.changeRef.detectChanges();
        },
        this.toolbarEl.nativeElement.firstChild.clientHeight);
    });
    this.initDrawer();
    this.changeRef.detectChanges();
  }

  initDrawer() {
    if (this.drawer) {
      this.drawer.autoFocus = false;
      this.drawer.openedStart.pipe(mergeMap(() => this.drawer._animationEnd)).subscribe(() => {
        this.layoutService.showSpeedDial();
        this.layoutService.setReady();
      });
    }
  }

  get isOpen(): Observable<boolean> {
    return combineLatest([this.isReady, this.isHandset$, this.openedSidebar$]).pipe(
      map(([r, h, o]) => (!h && r) || o)
    );
  }

  getState(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRouteData.state : 'empty';
  }
}
