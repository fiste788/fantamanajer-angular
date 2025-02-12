import { trigger } from '@angular/animations';
import { AsyncPipe, DOCUMENT, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
  inject,
  effect,
  afterNextRender,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { delay } from 'rxjs';

import { VisibilityState } from '@app/enums';
import { CurrentTransitionService, ScrollService } from '@app/services';
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
  readonly #scrollService = inject(ScrollService);
  readonly #transitionService = inject(CurrentTransitionService);
  readonly #document = inject<Document>(DOCUMENT);

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
  protected readonly hidden = VisibilityState.Hidden;

  constructor() {
    afterNextRender(() => {
      this.#setSkeletonColors();
    });
    effect(() => {
      if (this.#layoutService.routeContextChanged()) {
        const offset = this.topAppBar().nativeElement.clientHeight;
        this.#scrollService.offset?.set(offset);
      }
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
