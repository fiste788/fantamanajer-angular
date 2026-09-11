import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import { map } from 'rxjs';
import type { Observable } from 'rxjs';

import type { AtLeast } from '@app/interfaces';

import type { Selection } from '../interfaces';

const SELECTIONS_URL_SEGMENT = 'selections'; // Modifica suggerita per la nomenclatura

const routes = {
  teamSelectionById: (teamId: number, selectionId: number) => `/teams/${teamId}/${SELECTIONS_URL_SEGMENT}/${selectionId}`,
  teamSelections: (teamId: number) => `/teams/${teamId}/${SELECTIONS_URL_SEGMENT}`,
};

@Service()
export class SelectionService {

  readonly #http = inject(HttpClient);

  public createSelection(selection: AtLeast<Selection, 'team_id'>): Observable<AtLeast<Selection, 'id'>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.post<Selection>(routes.teamSelections(selection.team_id), selection); // Utilizzo del nome della rotta modificato (con team_id da rinominare)
  }

  public getLastOrNewTeamSelection(teamId: number): Observable<AtLeast<Selection, 'team_id'>> {
    // Modifica suggerita per la nomenclatura
    return this.getTeamSelections(teamId).pipe(map(a => a.at(-1) ?? createEmptySelection(teamId))); // Utilizzo del nome del metodo modificato
  }

  public getTeamSelections(teamId: number): Observable<Selection[]> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Selection[]>(routes.teamSelections(teamId)); // Utilizzo del nome della rotta modificato
  }

  public updateSelection(selection: Selection): Observable<Pick<Selection, 'id'>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.put<Pick<Selection, 'id'>>(
      routes.teamSelectionById(selection.team_id, selection.id), // Utilizzo della rotta centralizzata (con team_id da rinominare)
      selection,
    );
  }

}

function createEmptySelection(teamId: number): AtLeast<Selection, 'team_id'> {
  return {
    team_id: teamId,
  };
}
