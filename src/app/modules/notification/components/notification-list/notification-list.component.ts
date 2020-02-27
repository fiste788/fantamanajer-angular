import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createBoxAnimation } from '@app/core/animations/create-box.animation';
import { ApplicationService, NotificationService } from '@app/core/services';
import { Stream } from '@app/shared/models';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { NotificationOverlayService } from '../../modals/notification-overlay.service';
import { NotificationOverlayComponent } from '../../modals/notification-overlay/notification-overlay.component';

@Component({
  selector: 'fm-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  animations: [createBoxAnimation]
})
export class NotificationListComponent implements OnInit {
  stream: Observable<Stream>;
  @ViewChild(NotificationOverlayComponent) overlay: NotificationOverlayComponent;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly app: ApplicationService,
    private readonly overlayService: NotificationOverlayService
  ) {

  }

  ngOnInit(): void {
    if (this.app.team) {
      this.stream = this.notificationService.getNotificationCount(this.app.team.id)
        .pipe(flatMap(_ => this.notificationService.seen.toPromise()));
    }
  }

  seen(): void {
    this.stream = this.notificationService.seen;
  }

  open(el: ElementRef<HTMLButtonElement>): void {
    this.overlayService.open(el);
  }
}
