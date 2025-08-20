import { Injectable, computed, inject, linkedSignal, WritableSignal } from '@angular/core'; // Importa Signal, WritableSignal
import { firstValueFrom } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { TeamService } from '@data/services'; // Assicurati che il percorso sia corretto
import { Team } from '@data/types'; // Importa Team

@Injectable({
  providedIn: 'root',
})
export class TeamStoreService {
  readonly #authService = inject(AuthenticationService);
  readonly #teamService = inject(TeamService);

  // Modifica suggerita per la nomenclatura del signal privato
  readonly #currentTeamSignal: WritableSignal<Team | undefined> = linkedSignal<Team | undefined>(
    () => this.#authService.currentUser()?.teams?.at(0), // Utilizzo del nome del signal modificato in AuthService
    {
      equal: (a, b) => a?.id === b?.id,
    },
  );

  // Modifica suggerita per la nomenclatura del signal pubblico
  public readonly currentTeam = this.#currentTeamSignal.asReadonly();

  // Modifica suggerita per la nomenclatura e aggiunta commento
  public readonly requireCurrentTeam = computed(() => {
    // Modifica suggerita per la nomenclatura
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

  public async changeTeam(team: Team): Promise<Team | undefined> {
    try {
      // Utilizzo del nome del metodo modificato in TeamService
      const res = await firstValueFrom(this.#teamService.getTeamById(team.id), {
        defaultValue: undefined,
      });
      this.#currentTeamSignal.set(res); // Utilizzo del nome del signal modificato

      return res;
    } catch (error) {
      console.error('Error changing team:', error); // Log dell'errore

      // Decidere come gestire l'errore qui (es. lanciare l'errore,Migliore undefined)
      // throw error;
      return undefined; // Restituisce undefined in caso di errore
    }
  }
}
