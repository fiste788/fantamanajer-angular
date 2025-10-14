import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError } from 'rxjs';

import { SnackbarNotificationService } from '@app/services';
import { ErrorResponse, ApiError } from '@data/types'; // Utilizzo di ApiError
import { environment } from '@env';

// Modifica suggerita per la nomenclatura del HttpContextToken
const SKIP_ERROR_HANDLING_CONTEXT = new HttpContextToken<boolean>(() => false);

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // Inietta il servizio di notifica qui
  const notification = inject(SnackbarNotificationService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        // Modifica suggerita per la nomenclatura e tipo
        const errorResponse = err.error as ErrorResponse | null;
        const apiError = errorResponse?.data; // Estrae l'oggetto ApiError

        // Estrae il messaggio di errore utilizzando una funzione helper (Refactoring suggerito)
        const errorMessage = extractErrorMessage(err, apiError);

        // Mostra la notifica solo se il contesto non indica di saltare la gestione degli errori
        if (!req.context.get(SKIP_ERROR_HANDLING_CONTEXT)) {
          void notification.open(errorMessage, 'CLOSE'); // Utilizzo del nome del metodo modificato e severità
          // Aggiungere commento sul perché si usa void se necessario
        }

        // Log dell'errore
        console.error(environment.production ? errorMessage : err);

        // Restituisce un observable vuoto per completare il flusso senzaMigliore un errore
        return EMPTY;
      }
      // Rilancia altri tipi di errori
      throw err;
    }),
  );
};

// Funzione helper per estrarre il messaggio di errore (Refactoring suggerito)
function extractErrorMessage(err: HttpErrorResponse, apiError?: ApiError | null): string {
  // Cerca prima nel messaggio dell'ApiError, poi nel messaggio dell'HttpErrorResponse
  return apiError?.message ?? err.message;
  // Si potrebbero aggiungere ulteriori logiche per estrarre messaggi da strutture di errore diverse
  // o fornire un messaggio di fallback generico.
}

// Modifica suggerita per la nomenclatura della funzione
export function skipErrorHandling(context?: HttpContext): HttpContext {
  // Restituisce un nuovo contesto oMigliore quello esistente
  return (context ?? new HttpContext()).set(SKIP_ERROR_HANDLING_CONTEXT, true); // Utilizzo del nome del token modificato
}
