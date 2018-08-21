import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../notification.service';
import { Notification } from '../notification';
import { ApplicationService } from '../../../core/application.service';

@Component({
  selector: 'fm-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  // notifications: Observable<Notification[]>;
  private subscription: Subscription;
  public notifications: Notification[] = [];

  constructor(
    public notificationService: NotificationService,
    private app: ApplicationService
  ) {
    this.subscription = this.notificationService.subscribe(payload => {
      this.notifications.push(payload);
    });
  }

  ngOnInit() {
    if (this.app.team) {
      this.notificationService.getNotifications(this.app.team.id);
    }
  }
}
