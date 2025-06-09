import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, afterNextRender, inject, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, firstValueFrom, Observable } from 'rxjs';

import { ApplicationService, PwaService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream, Team } from '@data/types';
import { type NotificationListModal as NotificationListModalType } from '@modules/notification/modals/notification-list/notification-list.modal';
import { SeasonActiveDirective } from '@shared/directives';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    SeasonActiveDirective,
    AsyncPipe,
    DecimalPipe,
  ],
})
export class NotificationComponent {
  readonly #notificationService = inject(NotificationService);
  readonly #dialog = inject(MatDialog);
  public readonly team = input<Team>();

  protected deferredPrompt$ = inject(PwaService).beforeInstall$;
  protected stream$: Observable<Stream> = EMPTY;
  protected readonly isCurrentSeason = inject(ApplicationService).isCurrentSeason;

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
      delete this.deferredPrompt$;

      return true;
    }

    return false;
  }

  protected async openDialog(): Promise<boolean | undefined> {
    const { NotificationListModal } = await import(
      '@modules/notification/modals/notification-list/notification-list.modal'
    );

    return firstValueFrom(
      this.#dialog
        .open<NotificationListModalType, unknown, boolean>(NotificationListModal, {
          scrollStrategy: new NoopScrollStrategy(),
          minWidth: 600,
          minHeight: 400,
        })
        .afterClosed(),
      { defaultValue: undefined },
    );
  }
}
