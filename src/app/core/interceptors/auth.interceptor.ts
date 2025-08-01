import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';



import { AuthenticationService, TokenStorageService } from '@app/authentication';

// Modifica suggerita per la nomenclatura e possibile spostamento in un file dedicato
export const SKIP_AUTH_INTERCEPTOR_CONTEXT = new HttpContextToken<boolean>(() => false);

// Definizione di una costante per il prefisso delle rotte di autenticazione/logout (Refactoring suggerito)
const AUTH_ROUTES_PREFIX = '/auth/';


// Funzione utility per gestire un errore 401 (Unauthorized)
function handleUnauthorizedError(): Observable<never> {
  // Chiamare logoutUI() eMigliore un Observable vuoto per terminare il flusso
  inject(AuthenticationService).logoutUI();
  return EMPTY; // Completa il flusso, impedendo agli subscriber di ricevere l'errore
}

// Funzione utility per gestire gli errori di autenticazione (401)
function handleAuthenticationErrors(
  source: Observable<HttpEvent<unknown>>,
  requestUrl: string,
): Observable<HttpEvent<unknown>> {
  return source.pipe(
    catchError((error: unknown) => {
      // Gestisce errori 401 Unauthorized, evitando le rotte di autenticazione/logout
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !requestUrl.includes(AUTH_ROUTES_PREFIX) // Utilizzo della costante
      ) {
        console.warn('Unauthorized response (401) received, triggering logout UI.'); // Log utile
        return handleUnauthorizedError(); // Gestisce il logout UI
      }

      // Rilancia altri tipi di errori o errori 401 per le rotte auth/logout
      // Se l'errore originale è un HttpErrorResponse,Migliore più utile rilanciare quello
      return throwError(() => (error instanceof HttpErrorResponse ? error : new Error('An unexpected error occurred'))); // Rilancia l'errore originale o un nuovo errore generico
    }),
  );
}

// Modifica suggerita per la nomenclatura e il refactoring
export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  // Salta l'intercettore se indicato nel contesto
  if (req.context.get(SKIP_AUTH_INTERCEPTOR_CONTEXT)) { // Utilizzo del nome del token modificato
    return next(req);
  }

  // Ottiene il token corrente dal servizio di storage
  const accessToken = inject(TokenStorageService).currentToken(); // Utilizzo del nome del signal modificato

  let requestWithAuth = req; // Modifica nomenclatura variabile

  // Aggiunge l'header di autorizzazione se il token è presente
  if (accessToken) {
    requestWithAuth = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  // Passa la richiesta modificata alla catena e applica la gestione degli errori 401
  return next(requestWithAuth).pipe((s) => handleAuthenticationErrors(s, requestWithAuth.url)); // Utilizzo nomenclatura variabile
};


// Modifica suggerita per la nomenclatura della funzione helper esportata
export function skipAuthInterceptor(context?: HttpContext): HttpContext {
  return (context ?? new HttpContext()).set(SKIP_AUTH_INTERCEPTOR_CONTEXT, true); // Utilizzo del nome del token modificato
}
