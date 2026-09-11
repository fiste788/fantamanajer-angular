import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import type { NotificationSubscription, NotificationSubscriptionsKeys, Team } from '@data/interfaces';

import { NOTIFICATION_SUBSCRIPTIONS } from '../../constants';

import type { Notification } from '../../interfaces';

@Component({
  selector: 'app-notification-subscription[type][label][subscriptions][team]',
  imports: [FormsModule, KeyValuePipe, MatListModule, MatSlideToggleModule],
  templateUrl: './notification-subscription.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSubscriptionComponent {

  public readonly label = input.required<string>();
  public readonly subscriptions = model.required<NotificationSubscription[]>();
  public readonly team = input.required<Team>();
  public readonly type = input.required<NotificationSubscriptionsKeys>();

  protected readonly map = computed(() => this.load());

  #keys?: Notification[];

  protected load(): Map<Notification, NotificationSubscription> {
    const map = new Map<Notification, NotificationSubscription>();
    this.#keys = NOTIFICATION_SUBSCRIPTIONS[this.type()];
    for (const element of this.#keys) {
      let sub = this.subscriptions().find(subscription => subscription.name === element.name);
      if (!sub) {
        sub = {
          enabled: false,
          name: element.name,
          team_id: this.team().id,
          type: this.type(),
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
