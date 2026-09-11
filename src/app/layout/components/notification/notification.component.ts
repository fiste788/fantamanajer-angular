import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { afterNextRender, Component, inject, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EMPTY, firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';

import { AppService, PwaService } from '@app/services';
import type { Stream, Team } from '@data/interfaces';
import { NotificationService } from '@data/services';
import type { NotificationListModal as NotificationListModalType } from '@modules/notification/components/modals/notification-list/notification-list.modal';
import { SeasonActiveDirective } from '@shared/directives';

@Component({
  selector: 'app-notification',
  imports: [AsyncPipe, DecimalPipe, MatBadgeModule, MatButtonModule, MatIconModule, SeasonActiveDirective],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {

  readonly #dialog = inject(MatDialog);
  readonly #notificationService = inject(NotificationService);
  // Using a signal to manage the deferred prompt state
  protected deferredPrompt = inject(PwaService).beforeInstallSignal;
  protected readonly isCurrentSeason = inject(AppService).isCurrentSeason;

  public readonly team = input<Team>();

  protected stream$: Observable<Stream> = EMPTY;

  constructor() {
    afterNextRender(() => {
      const team = this.team();
      if (team) {
        this.stream$ = this.loadStream(team);
      }
    });
  }

  public loadStream(team: Team): Observable<Stream> {
    return this.#notificationService.getNotificationCount(team.id);
  }

  protected async install(prompt: BeforeInstallPromptEvent, event: MouseEvent): Promise<boolean> {
    event.preventDefault();
    await prompt.prompt();

    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') {
      this.deferredPrompt.set(undefined); // Update the signal state

      return true;
    }

    return false;
  }

  protected async openDialog(): Promise<boolean | undefined> {
    const { NotificationListModal } = await import('@modules/notification/components/modals/notification-list/notification-list.modal');

    return firstValueFrom(
      this.#dialog
        .open<NotificationListModalType, unknown, boolean>(NotificationListModal, {
          minHeight: 400,
          minWidth: 600,
          scrollStrategy: new NoopScrollStrategy(),
        })
        .afterClosed(),
      { defaultValue: undefined },
    );
  }

}
