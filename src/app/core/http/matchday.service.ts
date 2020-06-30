import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { environment } from '@env';
import { Matchday } from '@shared/models';

const url = 'matchdays';
const routes = {
  current: `/${url}/current?force`,
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
    return this.httpWithoutIntercept.get<{ success: boolean, data: Matchday }>(environment.apiEndpoint + routes.current, {
      headers: {
        Accept: '*/*',
      },
      withCredentials: false,
    })
      .pipe(pluck('data'));
  }
}
