import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PushSubscription } from '../types';

const url = 'push-subscriptions';
const routes = {
  add: `/${url}`,
};

@Injectable({ providedIn: 'root' })
export class PushSubscriptionService {

  constructor(private readonly http: HttpClient) { }

  public add(subscription: PushSubscription): Observable<Partial<PushSubscription>> {
    return this.http.post(routes.add, subscription);
  }

  public delete(endpoint: string): Observable<Record<string, never>> {
    return this.http.delete<Record<string, never>>(`${routes.add}/${encodeURIComponent(endpoint)}`);
  }
}
