import { AsyncPipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, Observable } from 'rxjs';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { NotificationListComponent } from '@modules/notification/components/notification-list/notification-list.component';
import { createBoxAnimation } from '@shared/animations';
import { SeasonActiveDirective } from '@shared/directives';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    SeasonActiveDirective,
    AsyncPipe,
    DecimalPipe,
    NotificationListComponent,
  ],
})
export class NotificationComponent {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #notificationService = inject(NotificationService);
  readonly #app = inject(ApplicationService);

  protected readonly stream$ = this.#isBrowser ? this.loadStream() : EMPTY;

  public loadStream(): Observable<Stream> {
    const team = this.#app.requireTeam();
    const matchday = this.#app.matchday.value();

    return team.championship.season_id === matchday?.season_id
      ? this.#notificationService.getNotificationCount(team.id)
      : EMPTY;
  }
}
