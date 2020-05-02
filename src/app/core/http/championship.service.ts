import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Championship } from '@shared/models';

const url = 'championships';
const routes = {
  championships: `/${url}`,
  championship: (id: number) => `/${url}/${id}`
};

@Injectable({ providedIn: 'root' })
export class ChampionshipService {

  constructor(private readonly http: HttpClient) { }

  update(championship: Championship): Observable<{}> {
    return this.http.put(routes.championship(championship.id), championship);
  }

  create(championship: Championship): Observable<Championship> {
    return this.http.post<Championship>(routes.championships, championship);
  }

  save(championship: Championship): Observable<Partial<Championship>> {
    if (championship.id) {
      return this.update(championship);
    }

    return this.create(championship);
  }
}
