import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../app.config';
import { SharedService } from '../shared/shared.service';
import { Notification } from './notification';

@Injectable()
export class NotificationService {

  private notificationUrl = 'notifications';
  private headers = new Headers({ 'Accept': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private config: AppConfig,
    private http: AuthHttp,
    private shared: SharedService) {

  }

  getNotifications(): Promise<Notification[]> {
    return this.http.get(this.config.get('apiEndpoint') + 'teams/' + this.shared.currentTeam.id + '/' + this.notificationUrl, this.options)
      .toPromise()
      .then(response => response.json().data as Notification[])
      .catch(this.shared.handleError);
  }

}
