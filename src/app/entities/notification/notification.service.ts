import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { Notification } from './notification';
import { Stream } from '../../shared/stream/stream';
import { share } from 'rxjs/operators';

type MessageCallback = (payload: any) => void;

@Injectable()
export class NotificationService {
  notifications: Subject<Notification> = new Subject<Notification>();
  private url = 'notifications';
  @Output() seen: EventEmitter<Stream> = new EventEmitter<Stream>();

  constructor(private http: HttpClient) { }

  getNotifications(teamId: number): Observable<Stream> {
    const seen = this.http.get<Stream>('teams/' + teamId + '/' + this.url).pipe(share());
    seen.subscribe(res => this.seen.emit(res));
    return seen;
  }

  getNotificationCount(teamId: number): Observable<Stream> {
    return this.http.get<Stream>('teams/' + teamId + '/' + this.url + '/count');
  }

  broadcast(title: string, url: string, severity?: number) {
    this.notifications.next(new Notification(title, url, severity));
  }

  subscribe(callback: MessageCallback): Subscription {
    return this.notifications.subscribe(callback);
  }


}
