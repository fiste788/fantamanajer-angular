import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AtLeast } from '@app/types';
import { RecursivePartial } from '@app/types/recursive-partial.type';
import { EmptyLineup } from '@data/types/empty-lineup.model';

import { Lineup, Member } from '../types';

const LINEUPS_URL_SEGMENT = 'lineups'; // Modifica suggerita per la nomenclatura

const routes = {
  likelyLineup: (teamId: number) => `/teams/${teamId}/${LINEUPS_URL_SEGMENT}/likely`, // Modifica suggerita per la nomenclatura
  currentTeamLineup: (teamId: number) => `/teams/${teamId}/${LINEUPS_URL_SEGMENT}/current`, // Modifica suggerita per la nomenclatura
  teamLineups: (teamId: number) => `/teams/${teamId}/${LINEUPS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  updateLineup: (teamId: number, id: number) => `/teams/${teamId}/${LINEUPS_URL_SEGMENT}/${id}`, // Modifica suggerita per la nomenclatura
};

@Injectable({ providedIn: 'root' })
export class LineupService {
  readonly #http = inject(HttpClient);

  public static prepareLineupForApi(lineup: AtLeast<Lineup, 'team'>): RecursivePartial<Lineup> {
    const clonedLineup = { ...(lineup as Lineup) };
    const { dispositions } = clonedLineup;
    const disp = dispositions.filter((value) => value.member_id !== null).map((d) => ({ ...d }));

    for (const d of disp) d.member = undefined;
    const cleanedLineup: RecursivePartial<Lineup> = clonedLineup;
    cleanedLineup.dispositions = disp;
    delete cleanedLineup.team;
    delete cleanedLineup.modules;

    return cleanedLineup;
  }

  public getCurrentTeamLineup(teamId: number): Observable<EmptyLineup> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<EmptyLineup>(routes.currentTeamLineup(teamId), { params: { v: '2' } });
  }

  public updateLineup(lineup: AtLeast<Lineup, 'id' | 'team'>): Observable<Pick<Lineup, 'id'>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.put<Pick<Lineup, 'id'>>(
      routes.updateLineup(lineup.team.id, lineup.id), // Utilizzo del nome della rotta modificato
      LineupService.prepareLineupForApi(lineup), // Utilizzo del nome del metodo modificato
    );
  }

  public createLineup(lineup: AtLeast<Lineup, 'team'>): Observable<AtLeast<Lineup, 'id'>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.post<Lineup>(
      routes.teamLineups(lineup.team.id), // Utilizzo del nome della rotta modificato
      LineupService.prepareLineupForApi(lineup), // Utilizzo del nome del metodo modificato
    );
  }

  public getLikelyLineup(lineup: EmptyLineup): Observable<Array<Member>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<Member>>(routes.likelyLineup(lineup.team.id)); // Utilizzo del nome della rotta modificato
  }
}
