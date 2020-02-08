import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createBoxAnimation } from '@app/core/animations/create-box.animation';
import { Stream } from '@app/core/models';
import { ApplicationService, NotificationService } from '@app/core/services';
import { NotificationOverlayService } from '../../modals/notification-overlay.service';
import { NotificationOverlayComponent } from '../../modals/notification-overlay/notification-overlay.component';

@Component({
  selector: 'fm-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  animations: [createBoxAnimation]
})
export class NotificationListComponent implements OnInit {
  stream: Stream;
  @ViewChild(NotificationOverlayComponent) overlay: NotificationOverlayComponent;

  constructor(
    public notificationService: NotificationService,
    private readonly app: ApplicationService,
    private readonly overlayService: NotificationOverlayService
  ) {

  }

  ngOnInit(): void {
    if (this.app.team) {
      this.notificationService.getNotificationCount(this.app.team.id)
        .subscribe(res => {
          this.stream = res;
          this.notificationService.seen.subscribe((s: Stream) => this.stream = s);
        });
    }
  }

  open(el: ElementRef<HTMLButtonElement>): void {
    this.overlayService.open(el);
  }
}
