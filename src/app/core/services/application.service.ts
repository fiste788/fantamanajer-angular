import { ApplicationRef, Injectable, computed, inject, linkedSignal } from '@angular/core';
import { Subscription, interval, firstValueFrom, filter, tap, first, switchMap } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { MatchdayService, TeamService } from '@data/services';
import { Team } from '@data/types';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  readonly #authService = inject(AuthenticationService);
  readonly #matchdayService = inject(MatchdayService);
  readonly #teamService = inject(TeamService);
  public readonly matchday = this.#matchdayService.getCurrentMatchdayResource();

  readonly #isCurrentSeason = computed(
    () => this.matchday.value()?.season_id === this.team()?.championship.season_id,
  );

  public seasonEnded = computed(() =>
    this.#isCurrentSeason() ? (this.matchday.value()?.season.ended ?? false) : true,
  );
  public seasonStarted = computed(() =>
    this.#isCurrentSeason() ? (this.matchday.value()?.season.started ?? true) : true,
  );
  public readonly team = linkedSignal<Team | undefined>(
    () => this.#authService.user.value()?.teams?.at(0),
    { equal: (a, b) => a?.id === b?.id },
  );
  public readonly requireTeam = computed(() => this.team()!);

  public connect(): Subscription {
    const subscriptions = new Subscription();
    subscriptions.add(this.#refreshMatchday(inject(ApplicationRef)));

    return subscriptions;
  }

  public async changeTeam(team: Team): Promise<Team | undefined> {
    const res = await firstValueFrom(this.#teamService.getTeam(team.id), {
      defaultValue: undefined,
    });
    this.team.set(res);

    return res;
  }

  #refreshMatchday(appRef: ApplicationRef): Subscription {
    return appRef.isStable
      .pipe(
        filter((isStable) => isStable),
        first((stable) => stable),
        switchMap(() => interval(5 * 60 * 1000)),
        tap(() => this.matchday.reload()),
      )
      .subscribe();
  }
}
