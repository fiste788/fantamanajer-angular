import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stream } from '../models';

@Injectable({ providedIn: 'root' })
export class StreamService {
  private readonly url = 'stream';

  constructor(private readonly http: HttpClient) { }

  getByChampionship(championshipsId: number): Observable<Stream> {
    return this.http.get<Stream>(`championships/${championshipsId}/${this.url}`);
  }

  getByTeam(teamId: number, page = 1): Observable<Stream> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<Stream>(`teams/${teamId}/${this.url}`, { params });
  }

  getByClub(clubId: number): Observable<Stream> {
    return this.http.get<Stream>(`clubs/${clubId}/${this.url}`);
  }

  getByUser(userId: number): Observable<Stream> {
    return this.http.get<Stream>(`users/${userId}/${this.url}`);
  }

  get(context: 'teams' | 'users' | 'clubs' | 'championships', id: number, page = 1): Observable<Stream> {
    const params = new HttpParams().set('page', `${page}`);

    return this.http.get<Stream>(`${context}/${id}/${this.url}`, { params });
  }
}
