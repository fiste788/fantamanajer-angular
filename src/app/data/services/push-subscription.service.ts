import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PushSubscription } from '../types';

const url = 'push-subscriptions';
const routes = {
  add: `/${url}`,
};

@Injectable({ providedIn: 'root' })
export class PushSubscriptionService {
  readonly #http = inject(HttpClient);

  public add(subscription: Partial<PushSubscription>): Observable<Partial<PushSubscription>> {
    return this.#http.post(routes.add, subscription);
  }

  public delete(endpoint: string): Observable<Record<string, never>> {
    return this.#http.delete<Record<string, never>>(
      `${routes.add}/${encodeURIComponent(endpoint)}`,
    );
  }
}
