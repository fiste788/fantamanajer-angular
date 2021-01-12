import { trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { GoogleAnalyticsService, LayoutService, ScrollService } from '@app/services';
import { closeAnimation, routerTransition, scrollUpAnimation } from '@shared/animations';

import { SpeedDialComponent } from '../speed-dial/speed-dial.component';

@Component({
  animations: [
    trigger('contextChange', routerTransition),
    scrollUpAnimation,
    closeAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main',
  styleUrls: ['./main.component.scss'],
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav, { static: true }) public drawer: MatSidenav;
  @ViewChild(MatSidenavContent) public container: MatSidenavContent;
  @ViewChild(SpeedDialComponent) public speedDial: SpeedDialComponent;

  public isReady$: Observable<boolean>;
  public isOpen$: Observable<boolean>;
  public isHandset$: Observable<boolean>;
  public openedSidebar$: Observable<boolean>;
  public showedSpeedDial$: Observable<VisibilityState>;
  public showedToolbar$: Observable<VisibilityState>;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly scrollService: ScrollService,
    private readonly auth: AuthenticationService,
    private readonly layoutService: LayoutService,
    private readonly ngZone: NgZone,
    private readonly gaService: GoogleAnalyticsService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
  ) { }

  public ngOnInit(): void {
    this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/fantamanajer-icons.svg'));
    this.setupEvents();
  }

  public ngAfterViewInit(): void {
    this.layoutService.connect();
    this.scrollService.connect(this.container);
    this.ngZone.runOutsideAngular(() => {
      this.setupScrollAnimation();
    });
    this.initDrawer();
    this.changeRef.detectChanges();
  }

  public setupEvents(): void {
    this.isReady$ = this.layoutService.isReady$;
    this.isHandset$ = this.layoutService.isHandset$;
    this.openedSidebar$ = this.layoutService.openedSidebar$;
    this.isOpen$ = this.isOpenObservable();
    this.showedSpeedDial$ = combineLatest([this.layoutService.isShowSpeedDial$, this.auth.loggedIn$])
      .pipe(map(([v, u]) => u ? v : VisibilityState.Hidden));
    this.showedToolbar$ = this.layoutService.isShowToolbar$;
    this.drawer.openedChange.asObservable()
      .subscribe((a) => {
        this.layoutService.openSidebarSubject.next(a);
      });
    this.isReady$.pipe(
      filter(e => e),
      tap(() => {
        this.layoutService.showSpeedDial();
        setTimeout(() => this.document.querySelector('.pre-bootstrap')
          ?.remove(), 500);
      }),
    )
      .subscribe(() => {
        this.gaService.load();
      });
  }

  public setupScrollAnimation(): void {
    this.layoutService.connectScrollAnimation(this.up.bind(this), this.up.bind(this), this.getToolbarHeight());
  }

  public up(): void {
    this.updateSticky(this.getToolbarHeight());
  }

  public down(): void {
    this.speedDial.openSpeeddial = false;
    this.updateSticky(0);
  }

  public initDrawer(): void {
    this.drawer.autoFocus = false;
    // eslint-disable-next-line no-underscore-dangle
    this.drawer.openedStart.pipe(mergeMap(() => this.drawer._animationEnd))
      .subscribe(() => {
        this.layoutService.setReady();
      });

  }

  public isOpenObservable(): Observable<boolean> {
    return combineLatest([this.isReady$, this.isHandset$, this.openedSidebar$])
      .pipe(
        map(([r, h, o]) =>
          o || (!h && r)),
        distinctUntilChanged(),
      );
  }

  private updateSticky(offset: number): void {
    this.document.querySelectorAll('.sticky')
      .forEach((e: Element) => {
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
