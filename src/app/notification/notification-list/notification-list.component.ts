import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../notification';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'fm-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService,
    private shared: SharedService) { }

  ngOnInit() {
    if (this.shared.currentTeam) {
      this.notificationService.getNotifications(this.shared.currentTeam.id).then(
        notifications =>
        this.notifications = notifications
      );
    }
  }

}
