import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Selection } from '../types';

const url = 'selections';
const routes = {
  selection: (id: number) => `/teams/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class SelectionService {
  constructor(private readonly http: HttpClient) {}

  public getSelection(id: number): Observable<Selection> {
    return this.http.get<Array<Selection>>(routes.selection(id)).pipe(
      filter((a) => a.length > 0),
      map((a) => a[0]),
    );
  }

  public update(selection: Selection): Observable<Pick<Selection, 'id'>> {
    return this.http.put<Pick<Selection, 'id'>>(
      `${routes.selection(selection.team_id)}/${selection.id}`,
      selection,
    );
  }

  public create(selection: Selection): Observable<Partial<Selection>> {
    return this.http.post<Selection>(routes.selection(selection.team_id), selection);
  }
}
