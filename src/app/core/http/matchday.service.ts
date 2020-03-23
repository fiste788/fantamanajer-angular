import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env';
import { Matchday } from '@shared/models';

const url = 'matchdays';
const routes = {
  current: `/${url}/current`
};

@Injectable({ providedIn: 'root' })
export class MatchdayService {
  private readonly httpWithoutIntercept: HttpClient;

  constructor(
    httpback: HttpBackend
  ) {
    this.httpWithoutIntercept = new HttpClient(httpback);
  }

  getCurrentMatchday(): Observable<Matchday> {
    return this.httpWithoutIntercept.get<{ success: boolean, data: Matchday }>(environment.apiEndpoint + routes.current, {
      withCredentials: false
    })
      .pipe(
        map(r => r.data)
      );
  }
}
