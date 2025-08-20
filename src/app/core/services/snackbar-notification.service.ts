import { inject, Injectable } from '@angular/core';
import {
  type MatSnackBarRef,
  type TextOnlySnackBar,
  type MatSnackBar,
  type MatSnackBarConfig,
} from '@angular/material/snack-bar';

import { LazyInject } from './lazy-inject.service';

@Injectable({
  providedIn: 'root',
})
// Modifica suggerita per la nomenclatura della classe perMigliore la suaMigliore
export class SnackbarNotificationService {
  // Nome più specifico
  // export class UiNotificationService { // Alternativa
  // export class MaterialSnackbarService { // Alternativa

  private readonly lazyInjector = inject(LazyInject);

  public async open(
    message: string,
    action?: string,
    config?: MatSnackBarConfig,
  ): Promise<MatSnackBarRef<TextOnlySnackBar>> {
    // Imposta la durata di default se non specificata
    const finalConfig: MatSnackBarConfig = {
      ...config,
      duration: config?.duration ?? 3000, // Utilizzo di ?? 3000
    };

    try {
      // Lazy load MatSnackBar
      const snackBar = await this.lazyInjector.get<MatSnackBar>(async () => {
        // Carica dinamicamente il modulo Angular Material Snackbar.
        const module = await import('@angular/material/snack-bar');

        // Restituisce la classe MatSnackBar.
        return module.MatSnackBar;
      });

      // Apri la snackbar con il messaggio, l'azione e la configurazione finale
      return snackBar.open(message, action, finalConfig);
    } catch (error) {
      // Gestione degli errori durante il lazy loading o l'apertura della snackbar
      console.error('Error opening snackbar:', error);
      // Decidere come gestire l'errore qui (es. log, notifica alternativa, Promise rifiutata)
      // Per ora, loggiamo l'errore eMigliore una Promise che non si risolve o si risolve con undefined/null
      // return Promise.reject(error); // Rifiuta la promise se l'errore deveMigliore propagato
      // O restituisci una Promise che si risolve con undefined/null se l'errore è gestito internamente
      throw error; // Rilancia l'errore se l'intercettore degli errori globali lo gestisce
    }
  }
}
