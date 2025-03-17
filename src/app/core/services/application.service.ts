import { Injectable, computed, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { Team } from '@data/types';

import { MatchdayStoreService } from './matchday-store.service';
import { TeamStoreService } from './team-store.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  readonly #teamStore = inject(TeamStoreService);
  readonly #matchdayStore = inject(MatchdayStoreService);

  public readonly matchday = this.#matchdayStore.matchday;
  public readonly team = this.#teamStore.team;
  public readonly requireTeam = computed(() => this.team()!);

  public readonly isCurrentSeason = computed(() =>
    this.#matchdayStore.isCurrentSeason(this.team()),
  );
  public readonly seasonEnded = computed(() => this.#matchdayStore.isSeasonEnded(this.team()));
  public readonly seasonStarted = computed(() => this.#matchdayStore.isSeasonStarted(this.team()));

  public connect(): Subscription {
    return this.#matchdayStore.connect();
  }

  public async changeTeam(team: Team): Promise<Team | undefined> {
    return this.#teamStore.changeTeam(team);
  }
}
