import { HttpClient, HttpHeaders, httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { noErrorIt } from '@app/errors/http-error.interceptor';
import { noAuthIt, noHeadersIt } from '@app/interceptors';

import { Matchday } from '../types';

const url = 'matchdays';
const routes = {
  current: `/${url}/current`,
};

@Injectable({ providedIn: 'root' })
export class MatchdayService {
  readonly #http = inject(HttpClient);

  public getCurrentMatchdayResource(): HttpResourceRef<Matchday | undefined> {
    return httpResource(
      () => ({
        url: routes.current,
        headers: this.getHackyHttpHeaders(),
        context: noErrorIt(noHeadersIt(noAuthIt())),
        withCredentials: false,
      }),
      { equal: (a, b) => a?.id === b?.id },
    );
  }

  public getCurrentMatchday(): Observable<Matchday> {
    return this.#http.get<Matchday>(routes.current, {
      context: noErrorIt(noHeadersIt(noAuthIt())),
      withCredentials: false,
      headers: this.getHackyHttpHeaders(),
    });
  }

  private getHackyHttpHeaders(): HttpHeaders {
    class HackyHttpHeaders extends HttpHeaders {
      public override has(name: string): boolean {
        // Pretend the `Accept` header is set, so `HttpClient` will not try to set the default value.
        return name.toLowerCase() === 'accept' ? true : super.has(name);
      }
    }

    return new HackyHttpHeaders();
  }
}
