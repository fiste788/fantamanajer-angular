import type { HttpResourceRef } from '@angular/common/http';
import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { Matchday, Member, Role } from '../interfaces';

const MEMBERS_URL_SEGMENT = 'members'; // Modifica suggerita per la nomenclatura

const routes = {
  championshipFreeMembers: (championshipId: number) => `/championships/${championshipId}/${MEMBERS_URL_SEGMENT}/free`, // Modifica suggerita per la nomenclatura
  championshipFreeMembersByRole: (championshipId: number, roleId: number) => `/championships/${championshipId}/${MEMBERS_URL_SEGMENT}/free/${roleId}`, // Modifica suggerita per la nomenclatura
  matchdayBestMembers: (matchdayId: number) => `/${MEMBERS_URL_SEGMENT}/matchdays/${matchdayId}/best`, // Modifica suggerita per la nomenclatura
  memberById: (id: number) => `/${MEMBERS_URL_SEGMENT}/${id}`, // Modifica suggerita per la nomenclatura
  membersByClub: (clubId: number) => `/clubs/${clubId}/${MEMBERS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  teamMembers: (teamId: number) => `/teams/${teamId}/${MEMBERS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  teamMembersNotOwned: (teamId: number, roleId: number) => `/teams/${teamId}/${MEMBERS_URL_SEGMENT}/not_mine/${roleId}`, // Modifica suggerita per la nomenclatura
};

@Service()
export class MemberService {

  readonly #http = inject(HttpClient);

  public getAllFreeMembers(championshipId: number): Observable<Record<Role['id'], Member[]>> {
    // Modifica suggerita per la nomenclatura
    const parameters = this.#createStatsOffParams(); // Utilizzo della funzione refactorizzata

    return this.#http.get<Record<Role['id'], Member[]>>(routes.championshipFreeMembers(championshipId), {
      // Utilizzo del nome della rotta modificato
      params: parameters,
    });
  }

  public getAvailableMembersForTeam(teamId: number, roleId: number): Observable<Member[]> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Member[]>(routes.teamMembersNotOwned(teamId, roleId)); // Utilizzo del nome della rotta modificato
  }

  public getBestMembers(matchdayId: number): Observable<Member[]> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Member[]>(routes.matchdayBestMembers(matchdayId)); // Utilizzo del nome della rotta modificato
  }

  public getBestMembersResource(matchday: () => Matchday | undefined): HttpResourceRef<Member[]> {
    // Modifica suggerita per la nomenclatura
    return httpResource(
      () => {
        const previousMatchdayId = this.#getPreviousMatchdayId(matchday()); // Utilizzo della funzione refactorizzata

        return previousMatchdayId === undefined ? undefined : routes.matchdayBestMembers(previousMatchdayId); // Utilizzo del nome della rotta modificato
      },
      { defaultValue: [] },
    );
  }

  public getFreeMembers(championshipId: number, roleId?: number, isStats = true): Observable<Member[]> {
    // Modifica suggerita per la nomenclatura e roleId opzionale
    let parameters = new HttpParams();
    if (!isStats) {
      parameters = this.#createStatsOffParams(); // Utilizzo della funzione refactorizzata
    }

    // Logica per selezionare la rotta migliorata (Refactoring suggerito)
    const path = roleId ? routes.championshipFreeMembersByRole(championshipId, roleId) : routes.championshipFreeMembers(championshipId);

    return this.#http.get<Member[]>(path, { params: parameters });
  }

  public getMemberById(id: number): Observable<Member> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Member>(routes.memberById(id)); // Utilizzo del nome della rotta modificato
  }

  public getMembersByClubId(clubId: number): Observable<Member[]> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Member[]>(routes.membersByClub(clubId)); // Utilizzo del nome della rotta modificato
  }

  public getMembersByClubIdResource(clubId: () => number): HttpResourceRef<Member[] | undefined> {
    // Modifica suggerita per la nomenclatura
    return httpResource(() => routes.membersByClub(clubId())); // Utilizzo del nome della rotta modificato
  }

  public getMembersByTeamId(teamId: number): Observable<Member[]> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Member[]>(routes.teamMembers(teamId)); // Utilizzo del nome della rotta modificato
  }

  // Funzione privata per creare parametri HTTP con stats=0 (Refactoring suggerito)
  #createStatsOffParams(): HttpParams {
    const parameters = new HttpParams();
    return parameters.set('stats', '0');
  }

  // Funzione privata per calcolare l'ID della giornata precedente (Refactoring suggerito)
  #getPreviousMatchdayId(currentMatchday: Matchday | undefined): number | undefined {
    return currentMatchday ? currentMatchday.id - 1 : undefined;
  }

}
