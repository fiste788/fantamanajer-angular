import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transfert } from '@app/shared/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransfertService {
  private readonly url = 'transferts';

  constructor(private readonly http: HttpClient) { }

  getTransfert(id: number): Observable<Array<Transfert>> {
    return this.http.get<Array<Transfert>>(`teams/${id}/${this.url}`);
  }

  create(transfert: Transfert): Observable<Transfert> {
    return this.http.post<Transfert>(`admin/${this.url}`, JSON.stringify(transfert));
  }

}
