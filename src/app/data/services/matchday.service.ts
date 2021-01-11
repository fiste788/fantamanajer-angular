import { HttpBackend, HttpClient } from '@angular/common/http';
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

  constructor(
    httpback: HttpBackend,
  ) {
    this.httpWithoutIntercept = new HttpClient(httpback);
  }

  public getCurrentMatchday(): Observable<Matchday> {
    return this.httpWithoutIntercept.get<{ success: boolean; data: Matchday }>(environment.apiEndpoint + routes.current, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: '*/*',
      },
      withCredentials: false,
    })
      .pipe(pluck('data'));
  }
}
