import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationSubscription, Team } from '@app/core/models';
import { notificationSubscriptions } from '../../notification-subscription.definition';

@Component({
  selector: 'fm-notification-subscription',
  templateUrl: './notification-subscription.component.html',
  styleUrls: ['./notification-subscription.component.scss']
})
export class NotificationSubscriptionComponent implements OnInit {
  @Input() type: string;
  @Input() label: string;
  @Input() subscriptions: Array<NotificationSubscription>;
  @Output() readonly subscriptionsChange: EventEmitter<Array<NotificationSubscription>>;
  @Input() team: Team;
  map = new Map<{ name: string, label: string }, NotificationSubscription>();
  private keys: [{ name: string, label: string }];

  constructor() {
    this.subscriptionsChange = new EventEmitter<Array<NotificationSubscription>>();
  }

  ngOnInit(): void {
    this.keys = notificationSubscriptions[this.type];
    this.keys.forEach(element => {
      let sub = this.subscriptions.find(subscription => subscription.name === element.name);
      if (!sub) {
        sub = new NotificationSubscription();
        sub.type = this.type;
        sub.name = element.name;
        sub.team_id = this.team.id;
        this.subscriptions.push(sub);
      }
      this.map.set(element, sub);
    });
  }

  toggle(): void {
    this.subscriptionsChange.emit(this.subscriptions);
  }
}
