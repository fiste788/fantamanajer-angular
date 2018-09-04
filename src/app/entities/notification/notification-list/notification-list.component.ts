import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../notification.service';
import { ApplicationService } from '../../../core/application.service';
import { Stream } from '../../../shared/stream/stream';
import { NotificationOverlayService } from '../notification-overlay.service';
import { NotificationOverlayComponent } from '../notification-overlay/notification-overlay.component';



@Component({
  selector: 'fm-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit {
  public stream: Stream = null;
  @ViewChild(NotificationOverlayComponent) overlay: NotificationOverlayComponent;

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
        this.notificationService.seen.subscribe(s => this.stream = s);
      });
    }
  }

  open($event) {
    this.overlayService.open($event.currentTarget);
  }
}
