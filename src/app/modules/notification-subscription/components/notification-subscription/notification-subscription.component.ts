import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NotificationSubscription, Team } from '@shared/models';

import { notificationSubscriptions } from '../../notification-subscription.definition';

interface Notification {
  name: string;
  label: string;
}

@Component({
  selector: 'fm-notification-subscription',
  templateUrl: './notification-subscription.component.html',
  styleUrls: ['./notification-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationSubscriptionComponent implements OnInit {
  @Input() type: string;
  @Input() label: string;
  @Input() subscriptions: Array<NotificationSubscription>;
  @Input() team: Team;

  @Output() readonly subscriptionsChange: EventEmitter<Array<NotificationSubscription>> =
    new EventEmitter<Array<NotificationSubscription>>();

  map = new Map<Notification, NotificationSubscription>();
  private keys: [Notification];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
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

  track(_: number, item: KeyValue<Notification, NotificationSubscription>): string {
    return item.key.name; // or item.id
  }
}
