import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stream } from './stream';

@Injectable()
export class StreamService {
  private url = 'stream';

  constructor(private http: HttpClient) { }

  getByChampionship(championships_id: number): Observable<Stream> {
    return this.http.get<Stream>(`championships/${championships_id}/${this.url}`);
  }

  getByTeam(teamId: number, page = 1): Observable<Stream> {
    console.log('getbyt');
    return this.http.get<Stream>(`teams/${teamId}/${this.url}?page=${page}`);
  }

  getByClub(clubId: number): Observable<Stream> {
    return this.http.get<Stream>(`clubs/${clubId}/${this.url}`);
  }

  getByUser(userId: number): Observable<Stream> {
    return this.http.get<Stream>(`users/${userId}/${this.url}`);
  }

  get(context: 'teams' | 'users' | 'clubs' | 'championships', id: number, page = 1): Observable<Stream> {
    return this.http.get<Stream>(`${context}/${id}/${this.url}?page=${page}`);
  }
}
