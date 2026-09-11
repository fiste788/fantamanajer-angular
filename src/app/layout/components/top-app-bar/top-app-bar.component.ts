import type { Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { AppService, NAVIGATOR, ScrollService } from '@app/services';
import { BreadcrumbComponent } from '@shared/components/breadcrumb';
import { TabChangedTransitionDirective } from '@shared/directives';

import { NavigationDrawerButtonComponent } from '../navigation-drawer-button/navigation-drawer-button.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-top-app-bar',
  imports: [BreadcrumbComponent, MatIconModule, MatToolbarModule, NavigationDrawerButtonComponent, NotificationComponent, TabChangedTransitionDirective],
  templateUrl: './top-app-bar.component.html',
  styleUrl: './top-app-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-scrolled]': 'isScrolled()',
    '[class.window-overlayed]': 'isOverlayed()',
  },
})
export class TopAppBarComponent {

  readonly #applicationService = inject(AppService); // Renamed injected service
  // Renamed injected services for clarity
  readonly #authenticationService = inject(AuthenticationService);
  readonly #navigator = inject<Navigator>(NAVIGATOR);
  protected readonly isScrolled = inject(ScrollService).isScrolled;

  protected readonly isOverlayed = this.#getOverlayedSignal();
  protected readonly loggedIn = this.#authenticationService.isLoggedIn; // Updated service name
  protected readonly team = this.#applicationService.currentTeam; // Updated service name

  #getOverlayedSignal(): Signal<boolean> {
    if (this.#navigator.windowControlsOverlay) {
      const isOverlayed$ = fromEvent<WindowControlsOverlayGeometryChangeEvent>(this.#navigator.windowControlsOverlay, 'geometrychange').pipe(
        debounceTime(150),
        map(event => event.visible),
        distinctUntilChanged(),
      );

      return toSignal(isOverlayed$, {
        initialValue: this.#navigator.windowControlsOverlay.visible,
      });
    }

    return signal(false);
  }

}
