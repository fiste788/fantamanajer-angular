import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PushSubscription } from '../types';

const PUSH_SUBSCRIPTIONS_URL_SEGMENT = 'push-subscriptions'; // Modifica suggerita per la nomenclatura

const routes = {
  subscriptionsCollection: `/${PUSH_SUBSCRIPTIONS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
  subscriptionByEndpoint: (endpoint: string) =>
    `/${PUSH_SUBSCRIPTIONS_URL_SEGMENT}/${encodeURIComponent(endpoint)}`, // Aggiunta rotta per l'eliminazione (Refactoring suggerito)
};

@Injectable({ providedIn: 'root' })
export class PushSubscriptionService {
  readonly #http = inject(HttpClient);

  public createSubscription(
    subscription: Partial<PushSubscription>,
  ): Observable<Partial<PushSubscription>> {
    // Modifica suggerita per la nomenclatura del metodo
    return this.#http.post(routes.subscriptionsCollection, subscription); // Utilizzo del nome della rotta modificato
  }

  public deleteSubscription(endpoint: string): Observable<Record<string, never>> {
    // Modifica suggerita per la nomenclatura del metodo
    return this.#http.delete<Record<string, never>>(
      routes.subscriptionByEndpoint(endpoint), // Utilizzo della rotta centralizzata
    );
  }
}
