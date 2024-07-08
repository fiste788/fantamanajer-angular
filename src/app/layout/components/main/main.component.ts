/* eslint-disable sort-keys */
import { trigger } from '@angular/animations';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  viewChild,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { combineLatest, EMPTY, fromEvent, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, share, throttleTime } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { CurrentTransitionService, WINDOW } from '@app/services';
import { routerTransition, scrollDownAnimation, scrollUpAnimation } from '@shared/animations';
import { StatePipe } from '@shared/pipes';

import { LayoutService } from '../../services';
import { BottomComponent } from '../bottom/bottom.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  animations: [trigger('contextChange', routerTransition), scrollUpAnimation, scrollDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main',
  styleUrl: './main.component.scss',
  templateUrl: './main.component.html',
  standalone: true,
  imports: [
    MatSidenavModule,
    NavbarComponent,
    ToolbarComponent,
    RouterOutlet,
    BottomComponent,
    AsyncPipe,
    StatePipe,
    NgClass,
  ],
})
export class MainComponent implements OnDestroy, AfterViewInit {
  readonly #subscriptions = new Subscription();
  readonly #layoutService = inject(LayoutService);
  readonly #ngZone = inject(NgZone);
  readonly #transitionService = inject(CurrentTransitionService);
  readonly #changeRef = inject(ChangeDetectorRef);
  readonly #window = inject<Window>(WINDOW);
  readonly #auth = inject(AuthenticationService);

  protected drawer = viewChild.required(MatSidenav);
  protected container = viewChild.required(MatSidenavContent);
  protected toolbar = viewChild.required<ToolbarComponent, ElementRef<HTMLElement>>(
    ToolbarComponent,
    {
      read: ElementRef,
    },
  );

  protected readonly isReady$ = inject(LayoutService).isReady$;
  protected readonly isHandset$ = inject(LayoutService).isHandset$;
  protected readonly isTablet$ = inject(LayoutService).isTablet$;
  protected readonly openedSidebar$ = inject(LayoutService).openedSidebar$;
  protected readonly isOpen$ = this.isOpenObservable();
  protected readonly showedSpeedDial$ = this.isShowedSpeedDial();
  protected readonly showedSpeedDialSignal = toSignal(this.showedSpeedDial$, {
    initialValue: VisibilityState.Hidden,
  });

  protected readonly showedToolbar$ = inject(LayoutService).isShowToolbar$;
  protected isScrolled$?: Observable<boolean>;

  constructor() {
    afterNextRender(() => {
      this.drawer()._content.nativeElement.parentElement!.style.display = 'block';
      this.setupScrollAnimation(this.#window);
    });
  }

  public ngAfterViewInit(): void {
    // this.subscriptions.add(this.preBootstrapExitAnimation().subscribe());
    this.#subscriptions.add(this.initDrawer().subscribe());
    this.#subscriptions.add(this.#layoutService.connectChangePageAnimation());
    this.#changeRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  protected open(open: boolean): void {
    this.#layoutService.toggleSidebar(open);
  }

  protected viewTransitionName() {
    return this.#transitionService.isRootOutlet() ? 'main' : '';
  }

  private setupScrollAnimation(window: Window): void {
    this.#ngZone.runOutsideAngular(() => {
      this.isScrolled$ = fromEvent(window, 'scroll').pipe(
        throttleTime(15),
        map(() => window.scrollY),
        map((y) => y > 48),
        distinctUntilChanged(),
        share(),
      );

      this.#layoutService.connectScrollAnimation(window, this.getToolbarHeight.bind(this));
    });
  }

  private initDrawer(): Observable<void> {
    return (
      this.drawer().openedStart.pipe(
        mergeMap(() => this.drawer()._animationEnd ?? EMPTY),
        map(() => this.#layoutService.setReady()),
      ) ?? EMPTY
    );
  }

  private isOpenObservable(): Observable<boolean> {
    return combineLatest([
      this.isReady$,
      this.isHandset$,
      this.isTablet$,
      this.openedSidebar$,
    ]).pipe(
      map(([r, h, t, o]) => o || (!h && !t && r)),
      distinctUntilChanged(),
    );
  }

  private isShowedSpeedDial(): Observable<VisibilityState> {
    return combineLatest([this.#layoutService.isShowSpeedDial$, this.#auth.loggedIn$]).pipe(
      map(([v, u]) => (u ? v : VisibilityState.Hidden)),
    );
  }

  private getToolbarHeight(): number {
    return this.toolbar().nativeElement.clientHeight ?? 0;
  }
}
