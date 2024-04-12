import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NotificationSubscription, NotificationSubscriptionsKeys, Team } from '@data/types';

import { Notification, notificationSubscriptions } from '../../types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatSlideToggleModule, NgIf, FormsModule, KeyValuePipe, NgFor, MatListModule],
  selector: 'app-notification-subscription[type][label][subscriptions][team]',
  styleUrl: './notification-subscription.component.scss',
  templateUrl: './notification-subscription.component.html',
})
export class NotificationSubscriptionComponent implements OnInit {
  @Input({ required: true }) public type!: NotificationSubscriptionsKeys;
  @Input({ required: true }) public label!: string;
  @Input({ required: true }) public subscriptions!: Array<NotificationSubscription>;
  @Input({ required: true }) public team!: Team;

  @Output() public readonly subscriptionsChange: EventEmitter<Array<NotificationSubscription>> =
    new EventEmitter<Array<NotificationSubscription>>();

  protected map = new Map<Notification, NotificationSubscription>();
  private keys?: Array<Notification>;

  public ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.keys = notificationSubscriptions[this.type];
    for (const element of this.keys) {
      let sub = this.subscriptions.find((subscription) => subscription.name === element.name);
      if (!sub) {
        sub = {
          enabled: false,
          type: this.type,
          name: element.name,
          team_id: this.team.id,
        };
        this.subscriptions.push(sub);
      }
      this.map.set(element, sub);
    }
  }

  protected toggle(): void {
    this.subscriptionsChange.emit(this.subscriptions);
  }
}
