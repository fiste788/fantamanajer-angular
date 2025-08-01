import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Transfer } from '../types';

const TRANSFERS_URL_SEGMENT = 'transferts'; // Modifica suggerita per la nomenclatura

const routes = {
  adminTransfertsCollection: `/admin/${TRANSFERS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  teamTransferts: (teamId: number) => `/teams/${teamId}/${TRANSFERS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
};

@Injectable({ providedIn: 'root' })
export class TransfertService {
  readonly #http = inject(HttpClient);

  public getTeamTransferts(teamId: number): Observable<Array<Transfer>> { // Modifica suggerita per la nomenclatura
    return this.#http.get<Array<Transfer>>(routes.teamTransferts(teamId)); // Utilizzo del nome della rotta modificato
  }

  public createTransfert(transfert: Partial<Transfer>): Observable<Partial<Transfer>> { // Modifica suggerita per la nomenclatura
    return this.#http.post<Transfer>(routes.adminTransfertsCollection, transfert); // Utilizzo del nome della rotta modificato
  }
}
