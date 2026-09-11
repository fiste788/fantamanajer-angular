import type { HttpInterceptorFn } from '@angular/common/http';
import { HttpContext, HttpContextToken, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, EMPTY } from 'rxjs';

import { ENVIRONMENT } from '@env';

import { SnackbarNotificationService } from '@app/services';
import type { ApiError, ErrorResponse } from '@data/interfaces'; // Utilizzo di ApiError

// Modifica suggerita per la nomenclatura del HttpContextToken
export const SKIP_ERROR_HANDLING_CONTEXT = new HttpContextToken<boolean>(() => false);

// Funzione helper per estrarre il messaggio di errore (Refactoring suggerito)
function extractErrorMessage(error: HttpErrorResponse, apiError?: ApiError | null): string {
  // Cerca prima nel messaggio dell'ApiError, poi nel messaggio dell'HttpErrorResponse
  return apiError?.message ?? error.message;
  // Si potrebbero aggiungere ulteriori logiche per estrarre messaggi da strutture di errore diverse
  // o fornire un messaggio di fallback generico.
}

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  // Inietta il servizio di notifica qui
  const notification = inject(SnackbarNotificationService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        // Modifica suggerita per la nomenclatura e tipo
        const errorResponse = error.error as ErrorResponse | null;
        const apiError = errorResponse?.data; // Estrae l'oggetto ApiError

        // Estrae il messaggio di errore utilizzando una funzione helper (Refactoring suggerito)
        const errorMessage = extractErrorMessage(error, apiError);

        // Mostra la notifica solo se il contesto non indica di saltare la gestione degli errori
        if (!request.context.get(SKIP_ERROR_HANDLING_CONTEXT)) {
          void notification.open(errorMessage, 'CLOSE'); // Utilizzo del nome del metodo modificato e severità
          // Aggiungere commento sul perché si usa void se necessario
        }

        // Log dell'errore
        console.error(ENVIRONMENT.production ? errorMessage : error);

        // Restituisce un observable vuoto per completare il flusso senzaMigliore un errore
        return EMPTY;
      }
      // Rilancia altri tipi di errori
      throw error;
    }),
  );
};

// Modifica suggerita per la nomenclatura della funzione
export function skipErrorHandling(context?: HttpContext): HttpContext {
  // Restituisce un nuovo contesto oMigliore quello esistente
  return (context ?? new HttpContext()).set(SKIP_ERROR_HANDLING_CONTEXT, true); // Utilizzo del nome del token modificato
}
