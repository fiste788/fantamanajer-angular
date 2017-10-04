import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Event } from './event';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventService {
  private url = 'events';

  constructor(private http: HttpClient) {}

  getEvents(championships_id: number): Promise<Event[]> {
    return this.http.get<Event[]>('championships/' + championships_id + '/' +  this.url)
      .toPromise()
  }
}
