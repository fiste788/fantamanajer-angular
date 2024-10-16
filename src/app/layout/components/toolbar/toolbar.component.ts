import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Signal,
  signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { CurrentTransitionService, NAVIGATOR } from '@app/services';
import { scrollUpAnimation } from '@shared/animations';
import { BreadcrumbComponent } from '@shared/components/breadcrumb';

import { LayoutService } from '../../services';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  animations: [scrollUpAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toolbar',
  styleUrl: './toolbar.component.scss',
  templateUrl: './toolbar.component.html',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    NotificationComponent,
    AsyncPipe,
  ],
})
export class ToolbarComponent {
  readonly #navigator = inject<Navigator>(NAVIGATOR);
  readonly #layoutService = inject(LayoutService);
  readonly #auth = inject(AuthenticationService);
  readonly #transitionService = inject(CurrentTransitionService);

  @HostBinding('class.window-overlayed')
  get overlayed() {
    return this.isOverlayed();
  }

  protected readonly loggedIn$ = this.#auth.loggedIn$;
  protected readonly isOverlayed = this.getOverlayedSignal();

  public clickNav(): void {
    this.#layoutService.toggleSidebar();
  }

  protected getOverlayedSignal(): Signal<boolean> {
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

  protected viewTransitionName(): string {
    return this.#transitionService.isTabChanged() ? '' : 'toolbar-tab';
  }
}
