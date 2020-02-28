import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PushSubscription } from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PushSubscriptionService {
  private readonly url = 'push-subscriptions';

  constructor(private readonly http: HttpClient) { }

  add(subscription: PushSubscription): Observable<any> {
    return this.http.post(this.url, subscription);
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.url}/${encodeURIComponent(endpoint)}`);
  }
}
