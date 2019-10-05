import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { PushSubscription } from '../models';

@Injectable({ providedIn: 'root' })
export class PushSubscriptionService {
  private url = 'push_subscriptions';

  constructor(private http: HttpClient) { }

  urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  add(subscription: PushSubscription): Observable<any> {
    return this.http.post(this.url, subscription);
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.url}/${encodeURIComponent(endpoint)}`);
  }
}
