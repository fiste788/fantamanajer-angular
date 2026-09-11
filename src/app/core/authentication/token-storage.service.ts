import type { WritableSignal } from '@angular/core';
import { inject, Service, signal } from '@angular/core'; // Importa WritableSignal

import { StorageService } from '@app/services/storage.service';

@Service()
export class TokenStorageService {

  readonly #localStorage = inject(StorageService);

  readonly #TOKEN_ITEM_NAME = 'token';
  // Modifica suggerita per la nomenclatura del signal
  readonly #currentTokenSignal: WritableSignal<string | undefined> = signal<string | undefined>(this.#localStorage.getItem(this.#TOKEN_ITEM_NAME) ?? undefined);

  // Modifica suggerita per la nomenclatura della proprietà pubblica
  public readonly currentToken = this.#currentTokenSignal.asReadonly();

  public deleteToken(): void {
    this.#localStorage.removeItem(this.#TOKEN_ITEM_NAME);
    this.#currentTokenSignal.set(undefined); // Utilizzo del nome del signal modificato
  }

  public setToken(token: string): void {
    this.#localStorage.setItem(this.#TOKEN_ITEM_NAME, token);
    this.#currentTokenSignal.set(token); // Utilizzo del nome del signal modificato
  }

  // PotrebbeMigliore utile aggiungere un metodo pubblico per ottenere il valore corrente direttamente
  // public getTokenValue(): string | undefined {
  //   return this.#currentTokenSignal();
  // }

}
