import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Matchday } from '../types';
import { noAuthIt } from '@app/interceptors';

const url = 'matchdays';
const routes = {
  current: `/${url}/current`,
};

@Injectable({ providedIn: 'root' })
export class MatchdayService {
  constructor(private readonly http: HttpClient) {}

  public getCurrentMatchday(): Observable<Matchday> {
    class HackyHttpHeaders extends HttpHeaders {
      has(name: string): boolean {
        // Pretend the `Accept` header is set, so `HttpClient` will not try to set the default value.
        return name.toLowerCase() === 'accept' ? true : super.has(name);
      }
    }
    return this.http.get<Matchday>(routes.current, {
      context: noAuthIt(),
      withCredentials: false,
      headers: new HackyHttpHeaders(),
    });
  }
}
