import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { share } from 'rxjs/operators';
import { Notification, Stream } from '../models';

type MessageCallback = (payload: any) => void;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications: Subject<Notification> = new Subject<Notification>();
  seen: EventEmitter<Stream> = new EventEmitter<Stream>();
  private readonly url = 'notifications';

  constructor(private readonly http: HttpClient) { }

  getNotifications(teamId: number): Observable<Stream> {
    const seen = this.http.get<Stream>(`teams/${teamId}/${this.url}`)
      .pipe(share());
    seen.subscribe(res => {
      this.seen.emit(res);
    });

    return seen;
  }

  getNotificationCount(teamId: number): Observable<Stream> {
    return this.http.get<Stream>(`teams/${teamId}/${this.url}/count`);
  }

  broadcast(title: string, url: string, severity?: number): void {
    this.notifications.next(new Notification(title, url, severity));
  }

  subscribe(callback: MessageCallback): Subscription {
    return this.notifications.subscribe(callback);
  }

}
