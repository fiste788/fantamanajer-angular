import { HttpClient, httpResource, HttpResourceRef, HttpContext } from '@angular/common/http'; // Importa HttpContext
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AuthenticationDto, ServerAuthInfo } from '@app/authentication';
import { skipErrorHandling } from '@app/errors/http-error.interceptor';
import { skipAuthInterceptor, skipUrlPrefix } from '@app/interceptors';

import { User } from '../types';

const USERS_URL_SEGMENT = 'users'; // Modifica suggerita per la nomenclatura

const routes = {
  currentUser: `/${USERS_URL_SEGMENT}/current`, // Modifica suggerita per la nomenclatura
  login: `/${USERS_URL_SEGMENT}/login`,
  logout: `/${USERS_URL_SEGMENT}/logout`,
  userById: (id: number) => `/${USERS_URL_SEGMENT}/${id}`, // Modifica suggerita per la nomenclatura e consolidamento con 'detail'
  setLocalSession: 'localdata/setsession', // Mantenuto il nome della rotta che riflette l'API
  deleteLocalSession: 'localdata/logout', // Mantenuto il nome della rotta che riflette l'API
};

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly #http = inject(HttpClient);

  public findUserResource(id: () => number | undefined): HttpResourceRef<User | undefined> {
    // Modifica suggerita per la nomenclatura
    return httpResource(() => {
      const userId = id();

      return userId === undefined ? undefined : routes.userById(userId); // Utilizzo del nome della rotta modificato
    });
  }

  public login(email: string, password: string, rememberMe = false): Observable<AuthenticationDto> {
    const body = {
      email,
      password,
      rememberMe,
    };

    return this.#http.post<AuthenticationDto>(routes.login, body);
  }

  public logout(): Observable<Record<string, never>> {
    // Mantenuto context: noErrorIt() come nell'originale, valutare seMigliore allineato con getLocalSessionContext
    return this.#http.get<Record<string, never>>(routes.logout, { context: skipErrorHandling() });
  }

  public updateUser(user: User): Observable<User> {
    // Modifica suggerita per la nomenclatura
    const userForUpdate = this.#prepareUserForUpdate(user); // Utilizzo della funzione refactorizzata

    // Assumendo che l'API PUT restituisca l'oggetto utente aggiornato o l'ID
    // Se l'API restituisce l'oggetto utente aggiornato, non è necessario mappare a () => user
    // Se l'API restituisce solo l'ID, mappare a () => user potrebbe essere per convenzione interna
    // Mantenuto il mapping originale per consistenza con il codice esistente
    return this.#http.put<User>(routes.userById(user.id), userForUpdate).pipe(map(() => user)); // Utilizzo del nome della rotta e dei dati preparati
  }

  public getCurrentUser(): Observable<User> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<User>(routes.currentUser); // Utilizzo del nome della rotta modificato
  }

  public getUserById(id: number): Observable<User> {
    // Modifica suggerita per la nomenclatura
    return this.#http.get<User>(routes.userById(id)); // Utilizzo del nome della rotta modificato
  }

  public setLocalSession(data: ServerAuthInfo): Observable<Record<string, never>> {
    return this.#http.post<Record<string, never>>(routes.setLocalSession, data, {
      context: this.#getLocalSessionContext(), // Utilizzo della funzione refactorizzata
    });
  }

  public deleteLocalSession(): Observable<Record<string, never>> {
    return this.#http.post<Record<string, never>>(routes.deleteLocalSession, undefined, {
      context: this.#getLocalSessionContext(), // Utilizzo della funzione refactorizzata
    });
  }

  // Funzione privata per "pulire" l'oggetto utente per l'API (Refactoring suggerito)
  #prepareUserForUpdate(user: User): Partial<User> {
    const userForUpdate: Partial<User> = { ...user };
    delete userForUpdate.teams; // Rimuove la proprietà teams

    // Considerare se ci sono altre proprietà che non dovrebbero essere inviate durante l'aggiornamento
    // delete userForUpdate.someOtherProperty;

    return userForUpdate;
  }

  // Funzione privata per creare il contesto HTTP per le operazioni locali (Refactoring suggerito)
  #getLocalSessionContext(): HttpContext {
    return skipUrlPrefix(skipAuthInterceptor(skipErrorHandling()));
  }
}
