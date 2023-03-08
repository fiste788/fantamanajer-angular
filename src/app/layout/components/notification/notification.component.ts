import { NgIf, AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, switchMap } from 'rxjs';

import { ApplicationService } from '@app/services';
import { NotificationService } from '@data/services';
import { Stream } from '@data/types';
import { createBoxAnimation } from '@shared/animations';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification',
  styleUrls: ['./notification.component.scss'],
  templateUrl: './notification.component.html',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule, MatBadgeModule, AsyncPipe, DecimalPipe],
})
export class NotificationComponent {
  @ViewChild('container', { read: ViewContainerRef }) protected container?: ViewContainerRef;

  protected readonly stream$: Observable<Stream>;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
  ) {
    this.stream$ = this.loadStream();
  }

  public loadStream(): Observable<Stream> {
    return this.app.requireTeam$.pipe(
      switchMap((t) => this.notificationService.getNotificationCount(t.id)),
    );
  }

  public async open(el: EventTarget | null): Promise<void> {
    if (this.container) {
      const notificationList = await import(
        '@modules/notification/components/notification-list/notification-list.component'
      ).then((m) => m.NotificationListComponent);

      const componentRef = this.container.createComponent(notificationList);
      componentRef.instance.open(new ElementRef(el));
    }
  }
}
