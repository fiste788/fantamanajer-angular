import { ApplicationRef, computed, inject, Service } from '@angular/core';

import { filter, first, interval, switchMap, tap } from 'rxjs';
import type { Subscription } from 'rxjs';

import type { Team } from '@data/interfaces'; // Importa Matchday
import { MatchdayService } from '@data/services'; // Assicurati che il percorso sia corretto

@Service()
export class MatchdayStoreService {

  readonly #matchdayService = inject(MatchdayService);

  // Modifica suggerita per la nomenclatura del HttpResourceRef
  readonly #currentMatchdayResource = this.#matchdayService.getCurrentMatchdayResource();

  // Modifica suggerita per la nomenclatura del signal pubblico
  public readonly currentMatchday = computed(() => this.#currentMatchdayResource.value());

  public isCurrentSeason(team?: Team): boolean {
    return this.currentMatchday()?.season_id === team?.championship.season_id; // Utilizzo del nome del signal modificato
  }

  public isSeasonEnded(team?: Team): boolean {
    return this.#checkSeasonProperty(team, 'ended'); // Utilizzo funzione refactorizzata
  }

  public isSeasonStarted(team?: Team): boolean {
    return this.#checkSeasonProperty(team, 'started'); // Utilizzo funzione refactorizzata

    // Nota: la logica originale aveva ?? true per isSeasonStarted, che sembra incoerente con ended.
    // Ho corretto a ?? false nel suggerimento di refactoring.
  }

  // Modifica suggerita per la nomenclatura (se appropriato al contesto)
  public startPeriodicRefresh(): Subscription {
    // Gestire l'unsubscribe di questa subscription quando il servizio viene distrutto
    // o quando la logica di aggiornamento non è più necessaria.
    return this.#refreshMatchday(inject(ApplicationRef));
  }

  // Refactoring: incapsulare la logica di base di verifica stagione (opzionale)
  #checkSeasonProperty(team?: Team, property?: 'ended' | 'started'): boolean {
    if (!this.isCurrentSeason(team)) {
      return true; // O false, a seconda della logica esatta quando nonMigliore stagione corrente
    }

    // Accede alla proprietà annidata in modo sicuro
    return property ? (this.currentMatchday()?.season[property] ?? false) : false; // Valore di fallback appropriato
  }

  #refreshMatchday(appReference: ApplicationRef): Subscription {
    return appReference.isStable
      .pipe(
        filter(isStable => isStable),
        first(stable => stable),
        switchMap(() => interval(5 * 60 * 1000)), // Aggiorna ogni 5 minuti
        tap(() => {
          console.log('Refreshing current matchday resource'); // Log utile per debugging
          this.#currentMatchdayResource.reload(); // Utilizzo del nome del HttpResourceRef modificato
        }),
        // Aggiungere takeUntil o un meccanismo per unsubscribere
        // takeUntil(this.destroy$) // Esempio con un Subject destroy$
      )
      .subscribe();
  }

}
