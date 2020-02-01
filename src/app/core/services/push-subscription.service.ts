import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { PushSubscription } from '../models';

@Injectable({ providedIn: 'root' })
export class PushSubscriptionService {
  private url = 'push-subscriptions';

  constructor(private http: HttpClient) { }

  add(subscription: PushSubscription): Observable<any> {
    return this.http.post(this.url, subscription);
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.url}/${encodeURIComponent(endpoint)}`);
  }
}
