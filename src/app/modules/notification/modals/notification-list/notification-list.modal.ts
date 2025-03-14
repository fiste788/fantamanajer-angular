import { AnimationEvent } from '@angular/animations';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

import { addVisibleClassOnDestroy } from '@app/functions';
import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { listItemAnimation, openOverlayAnimation } from '@shared/animations';
import { MatEmptyStateComponent } from '@shared/components/mat-empty-state';

@Component({
  animations: [openOverlayAnimation, listItemAnimation],
  selector: 'app-notification-overlay',
  styleUrl: './notification-list.modal.scss',
  templateUrl: './notification-list.modal.html',
  imports: [
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
  public readonly animationStateChanged = output<AnimationEvent>();

  protected readonly stream = this.loadData();
  protected animationState: 'enter' | 'leave' | 'void' = 'enter';

  constructor() {
    addVisibleClassOnDestroy(listItemAnimation);
  }

  public async loadData(): Promise<Stream | undefined> {
    const notifications = await firstValueFrom(
      this.#notificationService.getNotifications(this.#app.requireTeam().id),
      { defaultValue: undefined },
    );
    if (notifications) {
      this.seen.emit(notifications);
    }

    return notifications;
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }
}
