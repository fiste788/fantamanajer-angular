import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import {
  ApplicationService,
  CurrentTransitionService,
  NAVIGATOR,
  PwaService,
  ScrollService,
} from '@app/services';
import { createBoxAnimation, scrollUpAnimation } from '@shared/animations';
import { BreadcrumbComponent } from '@shared/components/breadcrumb';

import { LayoutService } from '../../services';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  animations: [scrollUpAnimation, createBoxAnimation],
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
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    NotificationComponent,
    AsyncPipe,
  ],
})
export class TopAppBarComponent {
  readonly #navigator = inject<Navigator>(NAVIGATOR);
  readonly #layoutService = inject(LayoutService);
  readonly #auth = inject(AuthenticationService);
  readonly #transitionService = inject(CurrentTransitionService);

  protected deferredPrompt$ = inject(PwaService).beforeInstall$;
  protected readonly isScrolled = inject(ScrollService).isScrolled;
  protected readonly team = inject(ApplicationService).team;
  protected readonly isCurrentSeason = inject(ApplicationService).isCurrentSeason;
  protected readonly loggedIn = this.#auth.loggedIn;
  protected readonly isOverlayed = this.#getOverlayedSignal();

  protected clickNav(): void {
    this.#layoutService.toggleDrawer();
  }

  protected async install(prompt: BeforeInstallPromptEvent, event: MouseEvent): Promise<boolean> {
    event.preventDefault();
    await prompt.prompt();

    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') {
      delete this.deferredPrompt$;

      return true;
    }

    return false;
  }

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
