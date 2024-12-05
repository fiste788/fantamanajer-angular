import { Component, ElementRef, inject, input, output } from '@angular/core';

import { createBoxAnimation } from '@shared/animations';

import { NotificationOverlayService } from '../../services/notification-overlay.service';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification-list',
  template: '',
  standalone: true,
})
export class NotificationListComponent {
  readonly #overlayService = inject(NotificationOverlayService);

  public readonly origin = input.required<ElementRef>();
  public readonly open = output();

  constructor() {
    this.open.subscribe(() => this.#overlayService.open(this.origin()));
  }
}
