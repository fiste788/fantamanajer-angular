import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Championship } from '../types';

const url = 'championships';
const routes = {
  championship: (id: number) => `/${url}/${id}`,
  championships: `/${url}`,
};

@Injectable({ providedIn: 'root' })
export class ChampionshipService {
  constructor(private readonly http: HttpClient) {}

  public update(championship: Championship): Observable<Pick<Championship, 'id'>> {
    return this.http.put<Pick<Championship, 'id'>>(
      routes.championship(championship.id),
      championship,
    );
  }

  public create(championship: Championship): Observable<Championship> {
    return this.http.post<Championship>(routes.championships, championship);
  }

  public save(championship: Championship): Observable<Partial<Championship>> {
    if (championship.id) {
      return this.update(championship);
    }

    return this.create(championship);
  }
}
