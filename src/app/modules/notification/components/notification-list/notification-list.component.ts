import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationService } from '@app/http';
import { ApplicationService } from '@app/services';
import { createBoxAnimation } from '@shared/animations/create-box.animation';
import { Stream } from '@shared/models';

import { NotificationListModal } from '../../modals/notification-list/notification-list.modal';
import { NotificationOverlayService } from '../../modals/notification-overlay.service';

@Component({
  selector: 'fm-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  animations: [createBoxAnimation]
})
export class NotificationListComponent implements OnInit {
  @ViewChild(NotificationListModal) overlay: NotificationListModal;

  stream$: Observable<Stream>;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
    private readonly overlayService: NotificationOverlayService
  ) {

  }

  ngOnInit(): void {
    if (this.app.team) {
      this.stream$ = this.notificationService.getNotificationCount(this.app.team.id);
    }
  }

  seen(): void {
    this.stream$ = this.notificationService.seen;
  }

  open(el: EventTarget | null): void {
    this.overlayService.open(el as unknown as ElementRef);
    this.notificationService.seen.subscribe();
  }
}
