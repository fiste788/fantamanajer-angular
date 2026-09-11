import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { Transfer } from '../interfaces';

const TRANSFERS_URL_SEGMENT = 'transferts'; // Modifica suggerita per la nomenclatura

const routes = {
  adminTransfertsCollection: `/admin/${TRANSFERS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  teamTransferts: (teamId: number) => `/teams/${teamId}/${TRANSFERS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
};

@Service()
export class TransfertService {

  readonly #http = inject(HttpClient);

  public createTransfert(transfert: Partial<Transfer>): Observable<Partial<Transfer>> {
    // Modifica suggerita per la nomenclatura
    return this.#http.post<Transfer>(routes.adminTransfertsCollection, transfert); // Utilizzo del nome della rotta modificato
  }

  public getTeamTransferts(teamId: number): Observable<Transfer[]> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<Transfer[]>(routes.teamTransferts(teamId)); // Utilizzo del nome della rotta modificato
  }

}
