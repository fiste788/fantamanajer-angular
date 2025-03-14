import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, afterNextRender, inject, input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, Observable } from 'rxjs';

import { NotificationService } from '@data/services';
import { Stream, Team } from '@data/types';
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
  public readonly team = input.required<Team>();

  readonly #notificationService = inject(NotificationService);

  protected stream$: Observable<Stream> = EMPTY;

  constructor() {
    afterNextRender(() => {
      this.stream$ = this.loadStream();
    });
  }

  public loadStream(): Observable<Stream> {
    return this.#notificationService.getNotificationCount(this.team().id);
  }
}
