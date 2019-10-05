import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService, ApplicationService } from '@app/core/services';
import { Stream } from '@app/core/models';
import { NotificationOverlayService } from '../../modals/notification-overlay.service';
import { NotificationOverlayComponent } from '../../modals/notification-overlay/notification-overlay.component';
import { createBoxAnimation } from '@app/core/animations/create-box.animation';

@Component({
  selector: 'fm-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  animations: [createBoxAnimation]
})
export class NotificationListComponent implements OnInit {
  public stream: Stream = null;
  @ViewChild(NotificationOverlayComponent, { static: false }) overlay: NotificationOverlayComponent;

  constructor(
    public notificationService: NotificationService,
    private app: ApplicationService,
    private overlayService: NotificationOverlayService,
  ) {

  }

  ngOnInit() {
    if (this.app.team) {
      this.notificationService.getNotificationCount(this.app.team.id).subscribe(res => {
        this.stream = res;
        this.notificationService.seen.subscribe((s: Stream) => this.stream = s);
      });
    }
  }

  open(event: any) {
    this.overlayService.open(event.currentTarget);
  }
}
