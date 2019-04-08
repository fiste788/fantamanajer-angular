import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, PagedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class EventService {
  private url = 'events';

  constructor(private http: HttpClient) { }

  getEvents(championships_id: number, page = 1): Observable<PagedResponse<Event[]>> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<PagedResponse<Event[]>>(
      `championships/${championships_id}/${this.url}`, { params }
    );
  }

  getStreamByTeam(teamId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`championships/${teamId}/${this.url}`);
  }
}
