import { KeyValue } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { NotificationSubscription, Team } from '@data/types';

import { Keys, Notification, notificationSubscriptions } from '../../types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-notification-subscription',
  styleUrls: ['./notification-subscription.component.scss'],
  templateUrl: './notification-subscription.component.html',
})
export class NotificationSubscriptionComponent implements OnInit {
  @Input() public type: Keys;
  @Input() public label: string;
  @Input() public subscriptions: Array<NotificationSubscription>;
  @Input() public team: Team;

  @Output() public readonly subscriptionsChange: EventEmitter<Array<NotificationSubscription>> =
    new EventEmitter<Array<NotificationSubscription>>();

  public map = new Map<Notification, NotificationSubscription>();
  private keys: Array<Notification>;

  public ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.keys = notificationSubscriptions[this.type];
    this.keys.forEach((element) => {
      let sub = this.subscriptions.find((subscription) => subscription.name === element.name);
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

  public toggle(): void {
    this.subscriptionsChange.emit(this.subscriptions);
  }

  public track(_: number, item: KeyValue<Notification, NotificationSubscription>): string {
    return item.key.name; // or item.id
  }
}
