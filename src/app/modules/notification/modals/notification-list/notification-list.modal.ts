import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, output, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  selector: 'app-notification-overlay',
  styleUrl: './notification-list.modal.scss',
  templateUrl: './notification-list.modal.html',
  imports: [
    MatDialogModule,
    MatListModule,
    MatIconModule,
    CdkScrollableModule,
    MatEmptyStateComponent,
    MatProgressSpinnerModule,
    AsyncPipe,
    DatePipe,
  ],
})
export class NotificationListModal {
  readonly #notificationService = inject(NotificationService);
  readonly #app = inject(ApplicationService);

  public readonly seen = output<Stream>();

  protected readonly stream$ = this.loadData();

  public async loadData(): Promise<Stream | undefined> {
    const notifications = await firstValueFrom(
      this.#notificationService.getNotifications(this.#app.requireCurrentTeam().id),
      { defaultValue: undefined },
    );
    if (notifications) {
      this.seen.emit(notifications);
    }

    return notifications;
  }
}
