import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AtLeast } from '@app/types';

import { Selection } from '../types';

const url = 'selections';
const routes = {
  selection: (id: number) => `/teams/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class SelectionService {
  readonly #http = inject(HttpClient);

  public getSelections(id: number): Observable<Array<Selection>> {
    return this.#http.get<Array<Selection>>(routes.selection(id));
  }

  public getLastOrNewSelection(id: number): Observable<Selection> {
    return this.getSelections(id).pipe(map((a) => a.at(-1) ?? ({} as Selection)));
  }

  public update(selection: Selection): Observable<Pick<Selection, 'id'>> {
    return this.#http.put<Pick<Selection, 'id'>>(
      `${routes.selection(selection.team_id)}/${selection.id}`,
      selection,
    );
  }

  public create(selection: AtLeast<Selection, 'team_id'>): Observable<AtLeast<Selection, 'id'>> {
    return this.#http.post<Selection>(routes.selection(selection.team_id), selection);
  }
}
