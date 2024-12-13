import { trigger } from '@angular/animations';
import { AsyncPipe, isPlatformBrowser, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  viewChild,
  inject,
  Signal,
  PLATFORM_ID,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { delay, EMPTY } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { VisibilityState } from '@app/enums';
import { CurrentTransitionService, ScrollService, WINDOW } from '@app/services';
import {
  closeAnimation,
  routerTransition,
  scrollDownAnimation,
  scrollUpAnimation,
} from '@shared/animations';
import { StatePipe } from '@shared/pipes';

import { LayoutService } from '../../services';
import { BottomBarComponent } from '../bottom-bar/bottom-bar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavbarSkeletonComponent } from '../navbar-skeleton/navbar-skeleton.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  animations: [
    trigger('contextChange', routerTransition),
    scrollUpAnimation,
    scrollDownAnimation,
    closeAnimation,
  ],
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
    BottomBarComponent,
    StatePipe,
    NgClass,
    AsyncPipe,
    NavbarSkeletonComponent,
  ],
})
export class MainComponent {
  readonly #layoutService = inject(LayoutService);
  readonly #transitionService = inject(CurrentTransitionService);
  readonly #window = inject<Window>(WINDOW);
  readonly #auth = inject(AuthenticationService);

  protected toolbar = viewChild.required<ToolbarComponent, ElementRef<HTMLElement>>(
    ToolbarComponent,
    {
      read: ElementRef,
    },
  );

  protected readonly stable = this.#layoutService.stable;
  protected readonly size = this.#layoutService.size;
  protected readonly stabilized$ = toObservable(this.size).pipe(delay(100));
  protected readonly openSidebar = this.#layoutService.openSidebar;
  protected readonly showSpeedDial = this.#layoutService.showSpeedDial;
  protected readonly showToolbar = this.#layoutService.showToolbar;
  protected readonly loggedIn$ = this.#auth.loggedIn$;
  protected readonly hidden = VisibilityState.Hidden;
  protected readonly isScrolled = this.#isScrolled();

  constructor() {
    afterNextRender(() => {
      this.#layoutService.connectScrollAnimation(this.#window, this.#getToolbarHeight.bind(this));
    });
  }

  protected viewTransitionName() {
    return this.#transitionService.currentTransition()?.previousUrl !== undefined &&
      this.#transitionService.isRootOutlet()
      ? 'main'
      : '';
  }

  #isScrolled(): Signal<boolean> {
    return toSignal(
      isPlatformBrowser(inject(PLATFORM_ID))
        ? inject(ScrollService).isScrolled(this.#window)
        : EMPTY,
      { initialValue: false },
    );
  }

  #getToolbarHeight(): number {
    return this.toolbar().nativeElement.clientHeight;
  }
}
