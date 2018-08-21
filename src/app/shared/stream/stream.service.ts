import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StreamActivity } from './stream-activity';
import { PagedResponse } from '../pagination/paged-response';

@Injectable()
export class StreamService {
  private url = 'stream';

  constructor(private http: HttpClient) { }

  getByChampionship(championships_id: number): Observable<StreamActivity[]> {
    return this.http.get<StreamActivity[]>(`championships/${championships_id}/${this.url}`);
  }

  getByTeam(teamId: number): Observable<StreamActivity[]> {
    return this.http.get<StreamActivity[]>(`teams/${teamId}/${this.url}`);
  }
}
