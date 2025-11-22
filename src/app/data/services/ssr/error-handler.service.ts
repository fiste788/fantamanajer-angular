import { ErrorHandler, inject, Injectable, InjectionToken, Provider } from '@angular/core';

export const SSR_STATUS_TOKEN = new InjectionToken<SSRStatus>('SSR_STATUS');

/**
 * TIPO ESTERNO PER LO STATO DI FALLIMENTO SSR (Rinominato e semplificato)
 * La presenza di 'error' indica un fallimento.
 */
export interface SSRStatus {
  // Contiene l'oggetto errore catturato (sarà undefined se non è ancora fallito)
  error?: unknown;
}

@Injectable()
export class ServerSideErrorHandler extends ErrorHandler {
  readonly #ssrStatus = inject<SSRStatus>(SSR_STATUS_TOKEN);

  public override handleError(error: unknown): void {
    this.#ssrStatus.error = error; // <--- AGGIUNTO IL SALVATAGGIO DELL'ERRORE

    // 3. NON rilanciare l'errore per impedire la cattura silenziosa interna.
  }
}
export function provideServerErrorHandler(): Array<Provider> {
  return [
    // Forniamo l'oggetto di stato mutabile come dipendenza per l'ErrorHandler
    { provide: ErrorHandler, useClass: ServerSideErrorHandler },
  ];
}
