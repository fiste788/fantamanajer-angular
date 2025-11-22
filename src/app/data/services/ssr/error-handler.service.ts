import { ErrorHandler, Injectable, Provider } from '@angular/core';

@Injectable()
export class ServerSideErrorHandler extends ErrorHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public override handleError(error: unknown): void {
    // Logga l'errore in modo che sia visibile nei log del Worker
    console.error('SSR RENDER ERROR CATCHED:', error);

    // RILANCIA L'ERRORE.
    // Questo è il passo fondamentale che fa fallire la Promise di rendering SSR,
    // garantendo che il try...catch nel Worker riceva l'eccezione e restituisca un 500.
    throw error;
  }
}
export function provideServerErrorHandler(): Array<Provider> {
  return [{ provide: ErrorHandler, useClass: ServerSideErrorHandler }];
}
