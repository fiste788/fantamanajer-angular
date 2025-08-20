import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AtLeast } from '@app/types';

import { Selection } from '../types';

const SELECTIONS_URL_SEGMENT = 'selections'; // Modifica suggerita per la nomenclatura

const routes = {
  teamSelections: (teamId: number) => `/teams/${teamId}/${SELECTIONS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  teamSelectionById: (teamId: number, selectionId: number) =>
    `/teams/${teamId}/${SELECTIONS_URL_SEGMENT}/${selectionId}`, // Aggiunta rotta specifica per l'aggiornamento
};

@Injectable({ providedIn: 'root' })
export class SelectionService {
  readonly #http = inject(HttpClient);

  public getTeamSelections(teamId: number): Observable<Array<Selection>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<Selection>>(routes.teamSelections(teamId)); // Utilizzo del nome della rotta modificato
  }

  public getLastOrNewTeamSelection(teamId: number): Observable<Selection> {
    // Modifica suggerita per la nomenclatura
    return this.getTeamSelections(teamId).pipe(map((a) => a.at(-1) ?? ({} as Selection))); // Utilizzo del nome del metodo modificato
  }

  public updateSelection(selection: Selection): Observable<Pick<Selection, 'id'>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.put<Pick<Selection, 'id'>>(
      routes.teamSelectionById(selection.team_id, selection.id), // Utilizzo della rotta centralizzata (con team_id da rinominare)
      selection,
    );
  }

  public createSelection(
    selection: AtLeast<Selection, 'team_id'>,
  ): Observable<AtLeast<Selection, 'id'>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.post<Selection>(routes.teamSelections(selection.team_id), selection); // Utilizzo del nome della rotta modificato (con team_id da rinominare)
  }
}
