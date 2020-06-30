import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Stream } from '@shared/models';

const url = 'stream';
const routes = {
  championships: (id: number) => `/championships/${id}/${url}`,
  club: (id: number) => `/clubs/${id}/${url}`,
  get: (context: string, id: number) => `/${context}/${id}/${url}`,
  team: (id: number) => `/teams/${id}/${url}`,
  user: (id: number) => `/users/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class StreamService {

  constructor(private readonly http: HttpClient) { }

  public getByChampionship(championshipsId: number, page = 1): Observable<Stream> {
    return this.http.get<Stream>(routes.championships(championshipsId), {
      params: {
        page: [`${page}`],
      },
    });
  }

  public getByTeam(teamId: number, page = 1): Observable<Stream> {
    return this.http.get<Stream>(routes.team(teamId), {
      params: {
        page: [`${page}`],
      },
    });
  }

  public getByClub(clubId: number, page = 1): Observable<Stream> {
    return this.http.get<Stream>(routes.club(clubId), {
      params: {
        page: [`${page}`],
      },
    });
  }

  public getByUser(userId: number, page = 1): Observable<Stream> {
    return this.http.get<Stream>(routes.user(userId), {
      params: {
        page: [`${page}`],
      },
    });
  }

  public get(context: 'teams' | 'users' | 'clubs' | 'championships', id: number, page = 1): Observable<Stream> {
    return this.http.get<Stream>(routes.get(context, id), {
      params: {
        page: [`${page}`],
      },
    });
  }
}
