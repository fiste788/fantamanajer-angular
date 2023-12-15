import { trigger } from '@angular/animations';
import { DOCUMENT, AsyncPipe } from '@angular/common';
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
import { combineLatest, EMPTY, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { WINDOW } from '@app/services';
import { closeAnimation, routerTransition, scrollUpAnimation } from '@shared/animations';
import { StatePipe } from '@shared/pipes';

import { LayoutService } from '../../services';
import { NavbarComponent } from '../navbar/navbar.component';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  animations: [trigger('contextChange', routerTransition), scrollUpAnimation, closeAnimation],
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
    AsyncPipe,
    StatePipe,
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

  private readonly subscriptions = new Subscription();

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(WINDOW) private readonly window: Window,
    private readonly auth: AuthenticationService,
    private readonly layoutService: LayoutService,
    private readonly ngZone: NgZone,
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
    // this.subscriptions.add(this.preBootstrapExitAnimation().subscribe());
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

  private setupScrollAnimation(window: Window): void {
    this.ngZone.runOutsideAngular(() => {
      this.layoutService.connectScrollAnimation(
        window,
        this.up.bind(this),
        this.down.bind(this),
        this.getToolbarHeight(),
      );
    });
  }

  private up(): void {
    this.updateSticky(this.getToolbarHeight());
  }

  private down(): void {
    this.speedDial?.close();
    this.updateSticky(0);
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

  private updateSticky(offset: number): void {
    // eslint-disable-next-line unicorn/no-array-for-each
    this.document.querySelectorAll<HTMLElement>('.sticky').forEach((e) => {
      e.style.top = `${offset}px`;
    });
    this.changeRef.detectChanges();
  }

  private getToolbarHeight(): number {
    return this.document.querySelector('app-toolbar')?.clientHeight ?? 0;
  }
}
