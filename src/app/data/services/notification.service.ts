import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, share, tap } from 'rxjs';

import { NAVIGATOR } from '@app/services/navigator.service';

import { Notification, Stream } from '../types';

const url = 'notifications';
const routes = {
  notifications: (id: number) => `/teams/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly #navigator = inject<Navigator>(NAVIGATOR);
  readonly #http = inject(HttpClient);

  public notifications = signal<Notification | undefined>(undefined);

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
    this.notifications.set({ title, url: uri, severity: severity ?? 0 });
  }
}
