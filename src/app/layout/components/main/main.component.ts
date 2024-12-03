import { trigger } from '@angular/animations';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  viewChild,
  inject,
} from '@angular/core';
import { MatSidenav, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ContentLoaderModule } from '@ngneat/content-loader';
import {
  combineLatest,
  fromEvent,
  Observable,
  Subscription,
  distinctUntilChanged,
  map,
  share,
  throttleTime,
} from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { CurrentTransitionService, WINDOW } from '@app/services';
import { routerTransition, scrollDownAnimation, scrollUpAnimation } from '@shared/animations';
import { StatePipe } from '@shared/pipes';

import { LayoutService } from '../../services';
import { BottomComponent } from '../bottom/bottom.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarSkeletonComponent } from '../navbar-skeleton/navbar-skeleton.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  animations: [trigger('contextChange', routerTransition), scrollUpAnimation, scrollDownAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main',
  host: { '[@.disabled]': '!stable()' },
  styleUrl: './main.component.scss',
  templateUrl: './main.component.html',
  imports: [
    MatSidenavModule,
    NavbarComponent,
    ToolbarComponent,
    RouterOutlet,
    ContentLoaderModule,
    BottomComponent,
    AsyncPipe,
    StatePipe,
    NgClass,
    NavbarSkeletonComponent,
  ],
})
export class MainComponent implements OnDestroy {
  readonly #subscriptions = new Subscription();
  readonly #layoutService = inject(LayoutService);
  readonly #ngZone = inject(NgZone);
  readonly #transitionService = inject(CurrentTransitionService);
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

  protected readonly stable = this.#layoutService.stable;
  protected readonly isHandset$ = this.#layoutService.isHandset$;
  protected readonly isTablet$ = this.#layoutService.isTablet$;
  protected readonly openSidebar = this.#layoutService.openSidebar;
  protected readonly showedSpeedDial$ = this.#isShowedSpeedDial();
  protected readonly showedToolbar$ = this.#layoutService.isShowToolbar$;
  protected isScrolled$?: Observable<boolean>;
  protected hidden = VisibilityState.Hidden;

  constructor() {
    afterNextRender(() => {
      this.#setupScrollAnimation(this.#window);
      this.#subscriptions.add(this.#layoutService.connectChangePageAnimation());
    });
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  protected viewTransitionName() {
    return this.#transitionService.currentTransition()?.previousUrl !== undefined &&
      this.#transitionService.isRootOutlet()
      ? 'main'
      : '';
  }

  protected openedChange(): void {
    if (this.drawer().mode !== 'over') {
      this.#layoutService.openSidebar.set(true);
    }
  }

  #setupScrollAnimation(window: Window): void {
    this.#ngZone.runOutsideAngular(() => {
      this.isScrolled$ = fromEvent(window, 'scroll').pipe(
        throttleTime(15),
        map(() => window.scrollY),
        map((y) => y > 48),
        distinctUntilChanged(),
        share(),
      );

      this.#layoutService.connectScrollAnimation(window, this.#getToolbarHeight.bind(this));
    });
  }

  #isShowedSpeedDial(): Observable<VisibilityState> {
    return combineLatest([this.#layoutService.isShowSpeedDial$, this.#auth.loggedIn$]).pipe(
      map(([v, u]) => (u ? v : VisibilityState.Hidden)),
    );
  }

  #getToolbarHeight(): number {
    return this.toolbar().nativeElement.clientHeight;
  }
}
