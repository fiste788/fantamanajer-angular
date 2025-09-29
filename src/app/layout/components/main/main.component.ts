import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
  inject,
  effect,
  afterNextRender,
  DOCUMENT,
  untracked,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { delay } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { CurrentTransitionService, ScrollService } from '@app/services';

import { LayoutService } from '../../services';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { NavigationDrawerComponent } from '../navigation-drawer/navigation-drawer.component';
import { NavigationSkeletonComponent } from '../navigation-skeleton/navigation-skeleton.component';
import { TopAppBarComponent } from '../top-app-bar/top-app-bar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main',
  styleUrl: './main.component.scss',
  templateUrl: './main.component.html',
  imports: [
    MatSidenavModule,
    TopAppBarComponent,
    RouterOutlet,
    NavigationBarComponent,
    AsyncPipe,
    NavigationSkeletonComponent,
    NavigationDrawerComponent,
  ],
  host: {
    '[class]': '"navigation-mode-" + navigationMode()',
    '[class.logged-in]': 'isLoggedIn()',
    '[class.stable]': 'isStable()',
    '[class.fullscreen]': 'fullscreen()',
  },
})
export class MainComponent {
  readonly #layoutService = inject(LayoutService);
  readonly #scrollService = inject(ScrollService);
  readonly #transitionService = inject(CurrentTransitionService);
  readonly #document = inject<Document>(DOCUMENT);

  protected topAppBarRef = viewChild.required<TopAppBarComponent, ElementRef<HTMLElement>>(
    TopAppBarComponent,
    {
      read: ElementRef,
    },
  );

  protected readonly isStable = this.#layoutService.stable; // Renamed from stable
  protected readonly navigationMode = this.#layoutService.navigationMode;
  protected readonly oldNavigationMode$ = toObservable(this.navigationMode).pipe(delay(100));
  protected readonly openDrawer = this.#layoutService.openDrawer;
  protected readonly fullscreen = this.#layoutService.fullscreen;
  protected readonly isLoggedIn = inject(AuthenticationService).isLoggedIn;

  constructor() {
    afterNextRender(() => {
      this.#setSkeletonColors();
    });
    effect(() => {
      const isRouteChanged = this.#layoutService.routeContextChanged();
      const topAppBarRef = this.topAppBarRef();
      untracked(() => {
        if (isRouteChanged) {
          this.#scrollService.offset.set(topAppBarRef.nativeElement.clientHeight);
        }
      });
    });
  }

  protected viewTransitionName(): string {
    return this.#transitionService.currentTransition()?.previousUrl !== undefined &&
      this.#transitionService.isRootOutlet()
      ? 'main'
      : '';
  }

  #setSkeletonColors(): void {
    const style = getComputedStyle(this.#document.body);
    const background = style.getPropertyValue('--mat-sys-secondary-fixed-dim');
    const foreground = style.getPropertyValue('--mat-sys-secondary-fixed');
    this.#layoutService.skeletonColors.set({ background, foreground });
  }
}
