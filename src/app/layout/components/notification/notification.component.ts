import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AsyncPipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, EMPTY, filter, firstValueFrom, Observable, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
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
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #notificationService = inject(NotificationService);
  readonly #dialog = inject(MatDialog);
  readonly #app = inject(ApplicationService);

  protected readonly stream$ = this.#isBrowser ? this.loadStream() : EMPTY;

  public loadStream(): Observable<Stream> {
    return combineLatest([this.#app.requireTeam$, this.#app.matchday$]).pipe(
      filter(([team, matchday]) => team.championship.season_id === matchday.season_id),
      switchMap(([team]) => this.#notificationService.getNotificationCount(team.id)),
    );
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
