import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Notification } from './notification';

@Injectable()
export class NotificationService {

  private url = 'notifications';

  constructor(private http: HttpClient) {
  }

  getNotifications(id: number): Promise<Notification[]> {
    return this.http.get<Notification[]>('teams/' + id + '/' + this.url)
      .toPromise()
  }

}
