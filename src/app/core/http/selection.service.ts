import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Selection } from '@shared/models';

const url = 'selections';
const routes = {
  selection: (id: number) => `/teams/${id}/${url}`
};

@Injectable({ providedIn: 'root' })
export class SelectionService {

  constructor(private readonly http: HttpClient) { }

  getSelection(id: number): Observable<Selection> {
    return this.http.get<Array<Selection>>(routes.selection(id))
      .pipe(
        filter(a => a.length > 0),
        map(a => a[0])
      );
  }

  update(selection: Selection): Observable<{}> {
    return this.http.put(`${routes.selection(selection.team_id)}/${selection.id}`, selection);
  }

  create(selection: Selection): Observable<Partial<Selection>> {
    return this.http.post<Selection>(routes.selection(selection.team_id), selection);
  }
}
