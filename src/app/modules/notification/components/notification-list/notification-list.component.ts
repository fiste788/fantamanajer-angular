import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationService } from '@data/services';
import { ApplicationService } from '@app/services';
import { createBoxAnimation } from '@shared/animations/create-box.animation';
import { Stream } from '@data/types';

import { NotificationListModal } from '../../modals/notification-list/notification-list.modal';
import { NotificationOverlayService } from '../../modals/notification-overlay.service';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification-list',
  styleUrls: ['./notification-list.component.scss'],
  templateUrl: './notification-list.component.html',
})
export class NotificationListComponent implements OnInit {
  @ViewChild(NotificationListModal) public overlay: NotificationListModal;

  public stream$: Observable<Stream>;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
    private readonly overlayService: NotificationOverlayService,
  ) {

  }

  public ngOnInit(): void {
    if (this.app.team) {
      this.stream$ = this.notificationService.getNotificationCount(this.app.team.id);
    }
  }

  public seen(): void {
    this.stream$ = this.notificationService.seen;
  }

  public open(el: EventTarget | null): void {
    this.overlayService.open(el as unknown as ElementRef);
    this.notificationService.seen.subscribe();
  }
}
