import { Component, ElementRef, ViewChild } from '@angular/core';

import { createBoxAnimation } from '@shared/animations';

import { NotificationListModal } from '../../modals/notification-list/notification-list.modal';
import { NotificationOverlayService } from '../../services/notification-overlay.service';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification-list',
  styleUrls: ['./notification-list.component.scss'],
  templateUrl: './notification-list.component.html',
})
export class NotificationListComponent {
  @ViewChild(NotificationListModal) public overlay: NotificationListModal;

  constructor(private readonly overlayService: NotificationOverlayService) {}

  public open(el: EventTarget | null): void {
    this.overlayService.open(el as unknown as ElementRef);
  }
}
