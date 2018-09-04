import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StreamActivity } from './stream-activity';
import { PagedResponse } from '../pagination/paged-response';
import { Stream } from './stream';

@Injectable()
export class StreamService {
  private url = 'stream';

  constructor(private http: HttpClient) { }

  getByChampionship(championships_id: number): Observable<Stream> {
    return this.http.get<Stream>(`championships/${championships_id}/${this.url}`);
  }

  getByTeam(teamId: number): Observable<Stream> {
    return this.http.get<Stream>(`teams/${teamId}/${this.url}`);
  }

  getByClub(clubId: number): Observable<Stream> {
    return this.http.get<Stream>(`clubs/${clubId}/${this.url}`);
  }

  getByUser(userId: number): Observable<Stream> {
    return this.http.get<Stream>(`users/${userId}/${this.url}`);
  }
}
