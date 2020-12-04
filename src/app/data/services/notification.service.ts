import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable } from '@angular/core';
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
  public notifications: Subject<Notification> = new Subject<Notification>();
  public seen: EventEmitter<Stream> = new EventEmitter<Stream>();

  constructor(
    @Inject(NAVIGATOR) private readonly navigator: Navigator,
    private readonly http: HttpClient,
  ) { }

  public getNotifications(teamId: number): Observable<Stream> {
    const seen = this.http.get<Stream>(routes.notifications(teamId))
      .pipe(share());
    seen.subscribe((res) => {
      this.seen.emit(res);
    });

    return seen;
  }

  public getNotificationCount(teamId: number): Observable<Stream> {
    return this.http.get<Stream>(`${routes.notifications(teamId)}/count`)
      .pipe(tap((s) => {
        if (this.navigator.setAppBadge) {
          this.navigator.setAppBadge(s.unseen);
        }
      }));
  }

  public broadcast(title: string, uri: string, severity?: number): void {
    this.notifications.next(new Notification(title, uri, severity));
  }

  public subscribe(callback: MessageCallback): Subscription {
    return this.notifications.subscribe(callback);
  }

}