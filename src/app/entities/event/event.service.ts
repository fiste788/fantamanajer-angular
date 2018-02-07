import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Event } from './event';

@Injectable()
export class EventService {
  private url = 'events';

  constructor(private http: HttpClient) {}

  getEvents(championships_id: number): Observable<Event[]> {
    return this.http.get<Event[]>(
      'championships/' + championships_id + '/' + this.url
    );
  }
}
