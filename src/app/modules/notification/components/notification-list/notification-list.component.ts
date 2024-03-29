import { Component, ElementRef } from '@angular/core';

import { createBoxAnimation } from '@shared/animations';

import { NotificationOverlayService } from '../../services/notification-overlay.service';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification-list',
  styleUrls: ['./notification-list.component.scss'],
  templateUrl: './notification-list.component.html',
  standalone: true,
})
export default class NotificationListComponent {
  constructor(private readonly overlayService: NotificationOverlayService) {}

  public open(el: ElementRef): void {
    this.overlayService.open(el);
  }
}
