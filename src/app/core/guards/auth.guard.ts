import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree // Importa UrlTree
} from '@angular/router';
import { AuthenticationService } from '@app/authentication';



// Definizione di una costante per la chiave dei dati della route 'authorities' (Refactoring suggerito)
const AUTHORITIES_ROUTE_DATA_KEY = 'authorities';

export const authenticatedGuard: CanActivateFn = async (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean | UrlTree> => { // Specificato il tipo di ritorno esatto
  const auth = inject(AuthenticationService);
  const router = inject(Router);

  // Verifica se l'utente è già loggato
  if (auth.isLoggedIn()) { // Utilizzo del nome del signal modificato
    // Se loggato, verifica le autorizzazioni richieste dalla route
    const requiredAuthorities = next.data[AUTHORITIES_ROUTE_DATA_KEY] as Array<string> | undefined; // Utilizzo della costante
    return auth.hasAuthorities(requiredAuthorities);
  }

  // Se non loggato, tenta l'autenticazione passkey silenziosa
  if (!(await attemptSilentPasskeyAuthentication(auth))) { // Refactoring: estrazione logica passkey
     // Se l'autenticazione passkey fallisce, gestisce il logout UI e reindirizza al login
    auth.logoutUI();

    return redirectToLogin(router, state.url); // Refactoring: estrazione logica reindirizzamento
  }

  // Se l'autenticazione passkey ha successo, consente l'accesso
  return true;
};

// Refactoring: funzione utility per tentare l'autenticazione passkey silenziosa
async function attemptSilentPasskeyAuthentication(authService: AuthenticationService): Promise<boolean> {
  try {
    // Tenta l'autenticazione passkey in modalità 'silent' (conditional mediation)
    return await authService.authenticatePasskey('conditional');
  } catch (error) {
    console.error('Silent passkey authentication failed:', error); // Log dell'errore specifico
    return false; // Restituisce false in caso di errore
  }
}

// Refactoring: funzione utility per creare l'UrlTree per il reindirizzamento al login
function redirectToLogin(router: Router, returnUrl: string): UrlTree {
   return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl } });
}
