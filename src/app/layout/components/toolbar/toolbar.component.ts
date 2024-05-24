import { NgIf, AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

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
    NgIf,
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent,
    NotificationComponent,
    AsyncPipe,
  ],
})
export class ToolbarComponent {
  @HostBinding('class.window-overlayed') get overlayed() {
    return this.isOverlayed();
  }

  protected readonly loggedIn$: Observable<boolean>;
  protected readonly isOverlayed$?: Observable<boolean>;
  protected isOverlayed: Signal<boolean>;

  constructor(
    @Inject(NAVIGATOR) private readonly navigator: Navigator,
    private readonly layoutService: LayoutService,
    private readonly auth: AuthenticationService,
    private readonly transitionService: CurrentTransitionService,
  ) {
    this.loggedIn$ = this.auth.loggedIn$;
    this.isOverlayed = this.getOverlayedSignal();
  }

  public clickNav(): void {
    this.layoutService.toggleSidebar();
  }

  protected getOverlayedSignal(): Signal<boolean> {
    if (this.navigator.windowControlsOverlay) {
      const isOverlayed$ = fromEvent<WindowControlsOverlayGeometryChangeEvent>(
        this.navigator.windowControlsOverlay,
        'geometrychange',
      ).pipe(
        debounceTime(150),
        map((e) => e.visible),
        distinctUntilChanged(),
      );

      return toSignal(isOverlayed$, {
        initialValue: this.navigator.windowControlsOverlay.visible,
      });
    }

    return signal(false);
  }

  protected viewTransitionName(): string {
    return this.transitionService.isTabChanged() ? '' : 'toolbar-tab';
  }
}
