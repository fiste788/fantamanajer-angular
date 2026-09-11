import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { AtLeast, RecursivePartial } from '@app/interfaces';

import type { Championship } from '../interfaces';

const CHAMPIONSHIPS_URL_SEGMENT = 'championships'; // Modifica suggerita per la nomenclatura

const routes = {
  championship: (id: number) => `/${CHAMPIONSHIPS_URL_SEGMENT}/${id}`,
  championships: `/${CHAMPIONSHIPS_URL_SEGMENT}`,
};

@Service()
export class ChampionshipService {

  readonly #http = inject(HttpClient);

  public create(championship: RecursivePartial<Championship>): Observable<Championship> {
    return this.#http.post<Championship>(routes.championships, championship);
  }

  public getChampionship(championshipId: number): Observable<Championship> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Championship>(routes.championship(championshipId));
  }

  public update(championship: AtLeast<Championship, 'id'>): Observable<Pick<Championship, 'id'>> {
    return this.#http.put<Pick<Championship, 'id'>>(routes.championship(championship.id), championship);
  }

}
