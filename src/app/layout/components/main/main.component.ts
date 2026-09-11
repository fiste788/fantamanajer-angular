import { AsyncPipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { delay } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ScrollService } from '@app/services';
import { MainTransitionDirective } from '@shared/directives';

import { LayoutService } from '../../services';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { NavigationDrawerComponent } from '../navigation-drawer/navigation-drawer.component';
import { NavigationSkeletonComponent } from '../navigation-skeleton/navigation-skeleton.component';
import { TopAppBarComponent } from '../top-app-bar/top-app-bar.component';

@Component({
  selector: 'app-main',
  imports: [
    AsyncPipe,
    MainTransitionDirective,
    MatSidenavModule,
    NavigationBarComponent,
    NavigationDrawerComponent,
    NavigationSkeletonComponent,
    RouterOutlet,
    TopAppBarComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.fullscreen]': 'fullscreen()',
    '[class.logged-in]': 'isLoggedIn()',
    '[class.stable]': 'isStable()',
    '[class]': '"navigation-mode-" + navigationMode()',
  },
})
export class MainComponent {

  readonly #document = inject<Document>(DOCUMENT);
  readonly #layoutService = inject(LayoutService);
  readonly #scrollService = inject(ScrollService);
  protected readonly isLoggedIn = inject(AuthenticationService).isLoggedIn;

  protected readonly fullscreen = this.#layoutService.fullscreen;
  protected readonly isStable = this.#layoutService.stable; // Renamed from stable
  protected readonly navigationMode = this.#layoutService.navigationMode;
  protected readonly oldNavigationMode$ = toObservable(this.navigationMode).pipe(delay(100));
  protected readonly openDrawer = this.#layoutService.openDrawer;
  protected readonly topAppBarRef = viewChild.required<TopAppBarComponent, ElementRef<HTMLElement>>(
    TopAppBarComponent,
    {
      read: ElementRef,
    },
  );

  constructor() {
    afterNextRender(() => {
      this.#setSkeletonColors();
      this.#scrollService.topAppBar.set(this.topAppBarRef().nativeElement);
    });
  }

  #setSkeletonColors(): void {
    const style = getComputedStyle(this.#document.body);
    const background = style.getPropertyValue('--mat-sys-secondary-fixed-dim');
    const foreground = style.getPropertyValue('--mat-sys-secondary-fixed');
    this.#layoutService.skeletonColors.set({ background, foreground });
  }

}
