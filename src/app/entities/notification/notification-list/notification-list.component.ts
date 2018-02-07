import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../notification.service';
import { Notification } from '../notification';
import { SharedService } from 'app/shared/shared.service';
import { Subscription } from 'rxjs/Subscription';

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
    private shared: SharedService
  ) {
    this.subscription = this.notificationService.subscribe(payload => {
      this.notifications.push(payload);
    });
  }

  ngOnInit() {
    if (this.shared.currentTeam) {
      this.notificationService.getNotifications(this.shared.currentTeam.id);
    }
  }
}
