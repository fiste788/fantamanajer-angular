import { trigger } from '@angular/animations';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  viewChild,
  inject,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { delay } from 'rxjs';

import { VisibilityState } from '@app/enums';
import { CurrentTransitionService, WINDOW } from '@app/services';
import {
  closeAnimation,
  routerTransition,
  scrollDownAnimation,
  scrollUpAnimation,
} from '@shared/animations';
import { StatePipe } from '@shared/pipes';

import { LayoutService } from '../../services';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { NavigationDrawerComponent } from '../navigation-drawer/navigation-drawer.component';
import { NavigationSkeletonComponent } from '../navigation-skeleton/navigation-skeleton.component';
import { TopAppBarComponent } from '../top-app-bar/top-app-bar.component';

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
    TopAppBarComponent,
    RouterOutlet,
    ContentLoaderModule,
    NavigationBarComponent,
    StatePipe,
    NgClass,
    AsyncPipe,
    NavigationSkeletonComponent,
    NavigationDrawerComponent,
  ],
})
export class MainComponent {
  readonly #layoutService = inject(LayoutService);
  readonly #transitionService = inject(CurrentTransitionService);
  readonly #window = inject<Window>(WINDOW);

  protected topAppBar = viewChild.required<TopAppBarComponent, ElementRef<HTMLElement>>(
    TopAppBarComponent,
    {
      read: ElementRef,
    },
  );

  protected readonly stable = this.#layoutService.stable;
  protected readonly navigationMode = this.#layoutService.navigationMode;
  protected readonly oldNavigationMode$ = toObservable(this.navigationMode).pipe(delay(100));
  protected readonly openDrawer = this.#layoutService.openDrawer;
  protected readonly showBars = this.#layoutService.showBars;
  protected readonly isScrolled = this.#layoutService.isScrolled;
  protected readonly hidden = VisibilityState.Hidden;

  constructor() {
    afterNextRender(() => {
      this.#layoutService.connectScrollAnimation(
        this.#window,
        () => this.topAppBar().nativeElement.clientHeight,
      );
    });
  }

  protected viewTransitionName() {
    return this.#transitionService.currentTransition()?.previousUrl !== undefined &&
      this.#transitionService.isRootOutlet()
      ? 'main'
      : '';
  }
}
