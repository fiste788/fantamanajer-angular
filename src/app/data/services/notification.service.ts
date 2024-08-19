import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { share, tap } from 'rxjs/operators';

import { NAVIGATOR } from '@app/services/navigator.service';

import { Notification, Stream } from '../types';

type MessageCallback = (payload: unknown) => void;

const url = 'notifications';
const routes = {
  notifications: (id: number) => `/teams/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly #navigator = inject<Navigator>(NAVIGATOR);
  readonly #http = inject(HttpClient);

  public notifications: Subject<Notification> = new Subject<Notification>();

  public getNotifications(teamId: number): Observable<Stream> {
    return this.#http.get<Stream>(routes.notifications(teamId)).pipe(share());
  }

  public getNotificationCount(teamId: number): Observable<Stream> {
    return this.#http.get<Stream>(`${routes.notifications(teamId)}/count`).pipe(
      tap((s) => {
        void this.#navigator.setAppBadge?.(s.unseen);
      }),
    );
  }

  public broadcast(title: string, uri: string, severity?: number): void {
    this.notifications.next({ title, url: uri, severity: severity ?? 0 });
  }

  public subscribe(callback: MessageCallback): Subscription {
    return this.notifications.subscribe(callback);
  }
}
