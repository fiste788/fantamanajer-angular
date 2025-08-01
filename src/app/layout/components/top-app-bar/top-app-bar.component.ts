import { ChangeDetectionStrategy, Component, Signal, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import {
  ApplicationService,
  CurrentTransitionService,
  NAVIGATOR,
  ScrollService,
} from '@app/services';
import { BreadcrumbComponent } from '@shared/components/breadcrumb';

import { NavigationDrawerButtonComponent } from '../navigation-drawer-button/navigation-drawer-button.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-app-bar',
  styleUrl: './top-app-bar.component.scss',
  templateUrl: './top-app-bar.component.html',
  host: {
    '[class.window-overlayed]': 'isOverlayed()',
    '[class.is-scrolled]': 'isScrolled()',
  },
  imports: [
    MatToolbarModule,
    MatIconModule,
    BreadcrumbComponent,
    NotificationComponent,
    NavigationDrawerButtonComponent,
  ],
})
export class TopAppBarComponent {
  readonly #navigator = inject<Navigator>(NAVIGATOR);
  readonly #auth = inject(AuthenticationService);
  readonly #transitionService = inject(CurrentTransitionService);

  protected readonly isScrolled = inject(ScrollService).isScrolled;
  protected readonly team = inject(ApplicationService).team;
  protected readonly loggedIn = this.#auth.loggedIn;
  protected readonly isOverlayed = this.#getOverlayedSignal();

  protected viewTransitionName(): string {
    return this.#transitionService.isTabChanged() ? '' : 'primary-tab';
  }

  #getOverlayedSignal(): Signal<boolean> {
    if (this.#navigator.windowControlsOverlay) {
      const isOverlayed$ = fromEvent<WindowControlsOverlayGeometryChangeEvent>(
        this.#navigator.windowControlsOverlay,
        'geometrychange',
      ).pipe(
        debounceTime(150),
        map((e) => e.visible),
        distinctUntilChanged(),
      );

      return toSignal(isOverlayed$, {
        initialValue: this.#navigator.windowControlsOverlay.visible,
      });
    }

    return signal(false);
  }
}
