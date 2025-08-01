import { HttpClient, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Matchday, Member, Role } from '../types';

const MEMBERS_URL_SEGMENT = 'members'; // Modifica suggerita per la nomenclatura

const routes = {
  matchdayBestMembers: (matchdayId: number) => `/${MEMBERS_URL_SEGMENT}/matchdays/${matchdayId}/best`, // Modifica suggerita per la nomenclatura
  membersByClub: (clubId: number) => `/clubs/${clubId}/${MEMBERS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  championshipFreeMembers: (championshipId: number) => `/championships/${championshipId}/${MEMBERS_URL_SEGMENT}/free`, // Modifica suggerita per la nomenclatura
  championshipFreeMembersByRole: (championshipId: number, roleId: number) => `/championships/${championshipId}/${MEMBERS_URL_SEGMENT}/free/${roleId}`, // Modifica suggerita per la nomenclatura
  memberById: (id: number) => `/${MEMBERS_URL_SEGMENT}/${id}`, // Modifica suggerita per la nomenclatura
  teamMembersNotOwned: (teamId: number, roleId: number) => `/teams/${teamId}/${MEMBERS_URL_SEGMENT}/not_mine/${roleId}`, // Modifica suggerita per la nomenclatura
  teamMembers: (teamId: number) => `/teams/${teamId}/${MEMBERS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
};

@Injectable({ providedIn: 'root' })
export class MemberService {
  readonly #http = inject(HttpClient);

  // Funzione privata per creare parametri HTTP con stats=0 (Refactoring suggerito)
  private createStatsOffParams(): HttpParams {
    return new HttpParams().set('stats', '0');
  }

  // Funzione privata per calcolare l'ID della giornata precedente (Refactoring suggerito)
  private getPreviousMatchdayId(currentMatchday: Matchday | undefined): number | undefined {
    return currentMatchday ? currentMatchday.id - 1 : undefined;
  }

  public getMembersByClubIdResource(clubId: () => number): HttpResourceRef<Array<Member> | undefined> { // Modifica suggerita per la nomenclatura
    return httpResource(() => routes.membersByClub(clubId())); // Utilizzo del nome della rotta modificato
  }

  public getFreeMembers(championshipId: number, roleId?: number, stats = true): Observable<Array<Member>> { // Modifica suggerita per la nomenclatura e roleId opzionale
    let params = new HttpParams();
    if (!stats) {
      params = this.createStatsOffParams(); // Utilizzo della funzione refactorizzata
    }

    // Logica per selezionare la rotta migliorata (Refactoring suggerito)
    const path = roleId
      ? routes.championshipFreeMembersByRole(championshipId, roleId)
      : routes.championshipFreeMembers(championshipId);

    return this.#http.get<Array<Member>>(path, { params });
  }

  public getAllFreeMembers(championshipId: number): Observable<Record<Role['id'], Array<Member>>> { // Modifica suggerita per la nomenclatura
    const params = this.createStatsOffParams(); // Utilizzo della funzione refactorizzata

    return this.#http.get<Record<Role['id'], Array<Member>>>(routes.championshipFreeMembers(championshipId), { // Utilizzo del nome della rotta modificato
      params,
    });
  }

  public getBestMembersResource(matchday: () => Matchday | undefined): HttpResourceRef<Array<Member>> { // Modifica suggerita per la nomenclatura
    return httpResource(
      () => {
        const previousMatchdayId = this.getPreviousMatchdayId(matchday()); // Utilizzo della funzione refactorizzata
        return previousMatchdayId !== undefined ? routes.matchdayBestMembers(previousMatchdayId) : undefined; // Utilizzo del nome della rotta modificato
      },
      { defaultValue: [] },
    );
  }

  public getBestMembers(matchdayId: number): Observable<Array<Member>> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<Member>>(routes.matchdayBestMembers(matchdayId)); // Utilizzo del nome della rotta modificato
  }

  public getMembersByTeamId(teamId: number): Observable<Array<Member>> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<Member>>(routes.teamMembers(teamId)); // Utilizzo del nome della rotta modificato
  }

  public getAvailableMembersForTeam(teamId: number, roleId: number): Observable<Array<Member>> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<Member>>(routes.teamMembersNotOwned(teamId, roleId)); // Utilizzo del nome della rotta modificato
  }

  public getMembersByClubId(clubId: number): Observable<Array<Member>> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<Member>>(routes.membersByClub(clubId)); // Utilizzo del nome della rotta modificato
  }

  public getMemberById(id: number): Observable<Member> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Member>(routes.memberById(id)); // Utilizzo del nome della rotta modificato
  }
}
