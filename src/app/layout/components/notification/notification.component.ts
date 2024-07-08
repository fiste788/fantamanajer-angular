import { NgIf, AsyncPipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewContainerRef,
  viewChild,
  inject,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { NotificationListComponent } from '@modules/notification/components/notification-list/notification-list.component';
import { createBoxAnimation } from '@shared/animations';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    AsyncPipe,
    DecimalPipe,
    NotificationListComponent,
  ],
})
export class NotificationComponent {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #notificationService = inject(NotificationService);
  readonly #app = inject(ApplicationService);

  protected container = viewChild<unknown, ViewContainerRef>('container', {
    read: ViewContainerRef,
  });

  protected buttonRef = viewChild.required<unknown, ElementRef>('button', { read: ElementRef });
  protected readonly stream$? = isPlatformBrowser(this.#platformId) ? this.loadStream() : undefined;

  public loadStream(): Observable<Stream> {
    return this.#app.requireTeam$.pipe(
      switchMap((t) => this.#notificationService.getNotificationCount(t.id)),
    );
  }
}
