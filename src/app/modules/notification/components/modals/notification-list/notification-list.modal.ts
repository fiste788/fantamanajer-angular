import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { firstValueFrom } from 'rxjs';

import { AppService } from '@app/services';
import type { Stream } from '@data/interfaces';
import { NotificationService } from '@data/services';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  selector: 'app-notification-overlay',
  imports: [AsyncPipe, CdkScrollableModule, DatePipe, MatDialogModule, MatEmptyStateComponent, MatIconModule, MatListModule, MatProgressSpinnerModule],
  templateUrl: './notification-list.modal.html',
  styleUrl: './notification-list.modal.scss',
})
export class NotificationListModal {

  readonly #app = inject(AppService);
  readonly #notificationService = inject(NotificationService);

  public readonly seen = output<Stream>();

  protected readonly stream$ = this.loadData();

  public async loadData(): Promise<Stream | undefined> {
    const notifications = await firstValueFrom(this.#notificationService.getNotifications(this.#app.requireCurrentTeam().id), { defaultValue: undefined });

    if (notifications) {
      this.seen.emit(notifications);
    }

    return notifications;
  }

}
