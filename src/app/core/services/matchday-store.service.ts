import { ApplicationRef, Injectable, computed, inject } from '@angular/core';
import { Subscription, interval, filter, tap, first, switchMap } from 'rxjs';

import { MatchdayService } from '@data/services';
import { Team } from '@data/types';

@Injectable({
  providedIn: 'root',
})
export class MatchdayStoreService {
  readonly #matchdayService = inject(MatchdayService);
  readonly #matchday = this.#matchdayService.getCurrentMatchdayResource();
  public readonly matchday = computed(() => this.#matchday.value());

  public connect(): Subscription {
    const subscriptions = new Subscription();
    subscriptions.add(this.#refreshMatchday(inject(ApplicationRef)));

    return subscriptions;
  }

  public isCurrentSeason(team?: Team): boolean {
    return this.matchday()?.season_id === team?.championship.season_id;
  }

  public isSeasonEnded(team?: Team): boolean {
    return this.isCurrentSeason(team) ? (this.matchday()?.season.ended ?? false) : true;
  }

  public isSeasonStarted(team?: Team): boolean {
    return this.isCurrentSeason(team) ? (this.matchday()?.season.started ?? true) : true;
  }

  #refreshMatchday(appRef: ApplicationRef): Subscription {
    return appRef.isStable
      .pipe(
        filter((isStable) => isStable),
        first((stable) => stable),
        switchMap(() => interval(5 * 60 * 1000)),
        tap(() => this.#matchday.reload()),
      )
      .subscribe();
  }
}
