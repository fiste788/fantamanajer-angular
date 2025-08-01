import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AtLeast, RecursivePartial } from '@app/types';

import { Championship } from '../types';

const CHAMPIONSHIPS_URL_SEGMENT = 'championships'; // Modifica suggerita per la nomenclatura

const routes = {
  championship: (id: number) => `/${CHAMPIONSHIPS_URL_SEGMENT}/${id}`,
  championships: `/${CHAMPIONSHIPS_URL_SEGMENT}`,
};

@Injectable({ providedIn: 'root' })
export class ChampionshipService {
  readonly #http = inject(HttpClient);

  public update(championship: AtLeast<Championship, 'id'>): Observable<Pick<Championship, 'id'> > {
    return this.#http.put<Pick<Championship, 'id'> >(
      routes.championship(championship.id),
      championship,
    );
  }

  public getChampionship(championshipId: number): Observable<Championship> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Championship>(routes.championship(championshipId));
  }

  public create(championship: RecursivePartial<Championship>): Observable<Championship> {
    return this.#http.post<Championship>(routes.championships, championship);
  }
}
