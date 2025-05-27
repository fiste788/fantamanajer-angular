import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, afterNextRender, inject, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, firstValueFrom, Observable } from 'rxjs';

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
  public readonly team = input.required<Team>();

  protected stream$: Observable<Stream> = EMPTY;

  constructor() {
    afterNextRender(() => {
      this.stream$ = this.loadStream();
    });
  }

  public loadStream(): Observable<Stream> {
    return this.#notificationService.getNotificationCount(this.team().id);
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
