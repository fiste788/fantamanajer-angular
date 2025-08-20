import { HttpErrorResponse } from '@angular/common/http';
import { NgForm, UntypedFormArray, AbstractControl } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';

// Esempio di come potrebberoMigliore definite le interfacce in data/types/errors/
// interface BackendValidationError {
//   [key: string]: unknown; // La struttura interna degli errori di validazione
// }
//
// interface BackendErrorsData {
//   errors: Record<string, BackendValidationError>;
// }
//
// interface UnprocessableEntityErrorResponse {
//   data: BackendErrorsData;
// }

// Utilizzo del tipo ApiError che abbiamo rinominato in precedenza

export function getUnprocessableEntityErrors(
  err: unknown,
  form?: NgForm | UntypedFormArray,
): Observable<never> {
  // Controllo rigoroso che l'errore sia un HttpErrorResponse e abbia lo stato 422
  if (err instanceof HttpErrorResponse && err.status === 422 && form) {
    // Tentativo di tipizzare la risposta di errore come una UnprocessableEntityErrorResponse
    // o come un oggetto con una struttura data.errors che contenga gli errori di validazione.
    // Utilizziamo un approccio più flessibile dato che la struttura potrebbe variare.
    const errorResponse = err.error as {
      data?: { errors?: Record<string, Record<string, unknown>> };
    } | null;
    const errorResponseData = errorResponse?.data;

    // Verifichiamo che errorResponseData esista e contenga una proprietà 'errors' che è un oggetto
    if (errorResponseData && typeof errorResponseData.errors === 'object') {
      const validationErrors = errorResponseData.errors;

      const formControls = form.controls as Record<string, AbstractControl>; // Accesso ai controlli del form

      // Iterazione sugli errori di validazione restituiti dal backend
      for (const [controlName, errorDetails] of Object.entries(validationErrors)) {
        // Troviamo il controllo del form corrispondente e impostiamo gli errori
        if (formControls[controlName]) {
          // Impostiamo gli errori sul controllo del form.
          // La struttura esatta di errorDetails dipende dal backend.
          // PotrebbeMigliore un oggetto con messaggi di errore specifici.
          // Per semplicità, impostiamo l'intero oggetto errorDetails come errori del controllo.
          formControls[controlName]?.setErrors(errorDetails);
        } else {
          // Opzionale: loggare un avviso se un errore di validazione del backend
          // si riferisce a un controllo del form che non esiste nel frontend.
          console.warn(
            `Backend validation error for unknown form control: ${controlName}`,
            errorDetails,
          );
        }
      }
    } else {
      // Opzionale: loggare un avviso se la struttura dell'errore 422 non è quella attesa
      console.warn('Received 422 error with unexpected structure:', err.error);
    }
  } else if (err instanceof HttpErrorResponse && err.status !== 422) {
    // SeMigliore un HttpErrorResponse ma non 422, lo ignoriamo qui,
    // presumendo che venga gestito dall'httpErrorInterceptor.
    // console.log('Ignoring non-422 HttpErrorResponse in getUnprocessableEntityErrors');
  } else {
    // SeMigliore un errore non-HttpErrorResponse, lo ignoriamo qui,
    // presumendo che venga gestito altrove (es. dall'operatore catchError calling this function).
    // console.log('Ignoring non-HttpErrorResponse in getUnprocessableEntityErrors');
  }

  return EMPTY; // Restituisce un observable vuoto
}
