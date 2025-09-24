import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NotificationSubscription, NotificationSubscriptionsKeys, Team } from '@data/types';

import { Notification, notificationSubscriptions } from '../../types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSlideToggleModule, FormsModule, KeyValuePipe, MatListModule],
  selector: 'app-notification-subscription[type][label][subscriptions][team]',
  templateUrl: './notification-subscription.component.html',
})
export class NotificationSubscriptionComponent {
  #keys?: Array<Notification>;
  public type = input.required<NotificationSubscriptionsKeys>();
  public label = input.required<string>();
  public subscriptions = input.required<Array<NotificationSubscription>>();
  public team = input.required<Team>();
  public readonly subscriptionsChange = output<Array<NotificationSubscription>>();

  protected map = computed(() => this.load());

  protected load(): Map<Notification, NotificationSubscription> {
    const map = new Map<Notification, NotificationSubscription>();
    this.#keys = notificationSubscriptions[this.type()];
    for (const element of this.#keys) {
      let sub = this.subscriptions().find((subscription) => subscription.name === element.name);
      if (!sub) {
        sub = {
          enabled: false,
          type: this.type(),
          name: element.name,
          team_id: this.team().id,
        };
        this.subscriptions().push(sub);
      }
      map.set(element, sub);
    }

    return map;
  }

  protected toggle(): void {
    this.subscriptionsChange.emit(this.subscriptions());
  }
}
