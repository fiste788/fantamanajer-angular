import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AtLeast, RecursivePartial } from '@app/types';

import { Team } from '../types';

const TEAMS_URL_SEGMENT = 'teams'; // Modifica suggerita per la nomenclatura

const routes = {
  teamsCollection: `/${TEAMS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  teamById: (id: number) => `/${TEAMS_URL_SEGMENT}/${id}`, // Modifica suggerita per la nomenclatura
  championshipTeams: (id: number) => `/championships/${id}/${TEAMS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
};

@Injectable({ providedIn: 'root' })
export class TeamService {
  readonly #http = inject(HttpClient);

  public getChampionshipTeams(championshipId: number): Observable<Array<Team>> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<Team>>(routes.championshipTeams(championshipId)); // Utilizzo del nome della rotta modificato
  }

  public getTeamById(id: number): Observable<Team> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Team>(routes.teamById(id)); // Utilizzo del nome della rotta modificato
  }

  public updateTeam(team: AtLeast<Team, 'id'>): Observable<Pick<Team, 'id'> > { // Modifica suggerita per la nomenclatura
    return this.#http.put(routes.teamById(team.id), team).pipe( // Utilizzo del nome della rotta modificato
      map(() => {
        // Commento per spiegare perché viene riemesso l'oggetto locale (Refactoring suggerito)
        // L'API restituisce solo l'ID, ma riemettiamo l'oggetto team locale
        // per permettere al subscriber di lavorare con l'oggetto completo se necessario.
        return { id: team.id }; // Ritorna un oggetto con solo l'ID come da tipo restituito
      }),
    );
  }

  public uploadTeamPhoto(id: number, formData: FormData): Observable<Pick<Team, 'photo_url'> > { // Modifica suggerita per la nomenclatura
    // Commento per spiegare l'uso di _method (Refactoring suggerito)
    // Questa tecnica viene utilizzata per inviare richieste PUT con multipart/form-data
    // a API che potrebbero non supportare direttamente questo metodo.
    formData.set('_method', 'PUT');

    // Rimuovere l'header 'Content-Type' manuale se HttpClient lo gestisce automaticamente (Refactoring suggerito)
    // Verificare se l'impostazione manuale è necessaria.
    return this.#http.post<Pick<Team, 'photo_url'> >(routes.teamById(id), formData, {
      // headers: {
      //   'Content-Type': 'multipart/form-data', // Probabilmente non necessario con FormData
      // },
    });
  }

  public createTeam(team: RecursivePartial<Team>): Observable<Team> { // Modifica suggerita per la nomenclatura
    return this.#http.post<Team>(routes.teamsCollection, team); // Utilizzo del nome della rotta modificato
  }
}
