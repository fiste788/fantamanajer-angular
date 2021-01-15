import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { environment } from '@env';

import { Matchday } from '../types';

const url = 'matchdays';
const routes = {
  current: `/${url}/current`,
};

@Injectable({ providedIn: 'root' })
export class MatchdayService {
  private readonly httpWithoutIntercept: HttpClient;

  constructor(httpback: HttpBackend) {
    this.httpWithoutIntercept = new HttpClient(httpback);
  }

  public getCurrentMatchday(): Observable<Matchday> {
    class HackyHttpHeaders extends HttpHeaders {
      has(name: string): boolean {
        // Pretend the `Accept` header is set, so `HttpClient` will not try to set the default value.
        return name.toLowerCase() === 'accept' ? true : super.has(name);
      }
    }
    return this.httpWithoutIntercept
      .get<{ success: boolean; data: Matchday }>(environment.apiEndpoint + routes.current, {
        withCredentials: false,
        headers: new HackyHttpHeaders(),
      })
      .pipe(pluck('data'));
    /*return from(
      fetch(environment.apiEndpoint + routes.current).then(async (res) => res.json()),
    ).pipe<Matchday>(pluck('data'));*/
    /*return this.httpWithoutIntercept
      .get<{ success: boolean; data: Matchday }>(environment.apiEndpoint + routes.current, {
        withCredentials: false,
      })
      .pipe(pluck('data'));*/
  }
}
