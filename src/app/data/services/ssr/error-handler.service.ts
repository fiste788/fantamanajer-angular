import { ErrorHandler, inject, Injectable, Provider, REQUEST_CONTEXT } from '@angular/core';

/**
 * TIPO ESTERNO PER LO STATO DI FALLIMENTO SSR (Rinominato e semplificato)
 * La presenza di 'error' indica un fallimento.
 */
export interface SSRStatus {
  // Contiene l'oggetto errore catturato (sarà undefined se non è ancora fallito)
  error?: unknown;
}

export interface RequestContext {
  ctx: ExecutionContext;
  nonce?: string;
  ssrStatus: SSRStatus;
}

@Injectable()
export class ServerSideErrorHandler extends ErrorHandler {
  readonly #requestContext = inject<RequestContext>(REQUEST_CONTEXT, { optional: true });

  public override handleError(error: unknown): void {
    if (this.#requestContext) {
      this.#requestContext.ssrStatus.error = error; // <--- AGGIUNTO IL SALVATAGGIO DELL'ERRORE
    } else {
      console.error('Server error handler', error);
    }
    // 3. NON rilanciare l'errore per impedire la cattura silenziosa interna.
  }
}
export function provideServerErrorHandler(): Array<Provider> {
  return [
    // Forniamo l'oggetto di stato mutabile come dipendenza per l'ErrorHandler
    { provide: ErrorHandler, useClass: ServerSideErrorHandler },
  ];
}
