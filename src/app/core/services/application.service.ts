import { Injectable, computed, inject } from '@angular/core'; // Importa Signal
import { Subscription } from 'rxjs';

import { Team } from '@data/types'; // Importa Matchday

import { MatchdayStoreService } from './matchday-store.service';
import { TeamStoreService } from './team-store.service';

@Injectable({
  providedIn: 'root',
})
// Modifica suggerita per la nomenclatura (alternativa)
// export class CurrentContextService {
// export class AppStateService {
export class ApplicationService { // Mantenuto ApplicationService per ora

  readonly #teamStore = inject(TeamStoreService);
  readonly #matchdayStore = inject(MatchdayStoreService);

  // Utilizzo di nomi leggermente più espliciti per i signals esposti (opzionale)
  public readonly currentMatchday = this.#matchdayStore.currentMatchday; // Modifica suggerita per la nomenclatura
  public readonly currentTeam = this.#teamStore.currentTeam; // Modifica suggerita per la nomenclatura

  // Modifica suggerita per la nomenclatura e aggiunta commento
  public readonly requireCurrentTeam = computed(() => { // Modifica suggerita per la nomenclatura
    // Nota: questo computed signal assume che il team non sia null.
    // Utilizzare solo quando si è certi che il team è stato caricato.
    const team = this.currentTeam(); // Utilizzo del nome del signal modificato
    if (!team) {
      // Opzionale: lanciare un errore esplicito se il team è inaspettatamente null
      // console.error('Attempted to access required team, but team is null.');
      // throw new Error('Required team is null.');
    }
    return team!; // Utilizzo dell'operatore di non-null assertion
  });


  public readonly isCurrentSeason = computed(() =>
    this.#matchdayStore.isCurrentSeason(this.currentTeam()), // Utilizzo del nome del signal modificato
  );
  public readonly seasonEnded = computed(() => this.#matchdayStore.isSeasonEnded(this.currentTeam())); // Utilizzo del nome del signal modificato
  public readonly seasonStarted = computed(() => this.#matchdayStore.isSeasonStarted(this.currentTeam())); // Utilizzo del nome del signal modificato

  // Modifica suggerita per la nomenclatura (se appropriato al contesto)
  public connectMatchdayStream(): Subscription {
    return this.#matchdayStore.startPeriodicRefresh();
  }

  public async changeTeam(team: Team): Promise<Team | undefined> {
    return this.#teamStore.changeTeam(team);
  }
}
