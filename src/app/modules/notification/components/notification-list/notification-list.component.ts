import { Component, ElementRef, OnInit, inject, input, output } from '@angular/core';

import { createBoxAnimation } from '@shared/animations';

import { NotificationOverlayService } from '../../services/notification-overlay.service';

@Component({
  animations: [createBoxAnimation],
  selector: 'app-notification-list',
  template: '',
  standalone: true,
})
export class NotificationListComponent implements OnInit {
  public readonly origin = input.required<ElementRef>();
  public readonly open = output();
  private readonly overlayService = inject(NotificationOverlayService);

  public ngOnInit(): void {
    this.openDialog();
    this.open.subscribe(() => this.openDialog());
  }

  private openDialog(): void {
    this.overlayService.open(this.origin());
  }
}
