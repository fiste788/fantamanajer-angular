import {
  ApplicationRef,
  Injectable,
  inject,
  linkedSignal,
  provideAppInitializer,
  signal,
  DOCUMENT,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  forkJoin,
  Observable,
  Subscription,
  interval,
  firstValueFrom,
  catchError,
  distinctUntilChanged,
  filter,
  tap,
  first,
  switchMap,
  share,
} from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { filterNil } from '@app/functions';
import { MatchdayService, TeamService } from '@data/services';
import { Matchday, Team } from '@data/types';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  readonly #document = inject<Document>(DOCUMENT);
  readonly #authService = inject(AuthenticationService);
  readonly #matchdayService = inject(MatchdayService);
  readonly #teamService = inject(TeamService);
  readonly #matchday = signal<Matchday | undefined>(undefined);
  readonly #team = signal<Team | undefined>(undefined);
  readonly #isCurrentSeason = linkedSignal(
    () => this.#matchday()?.season_id === this.#team()?.championship.season_id,
  );

  public seasonEnded = linkedSignal(() =>
    this.#isCurrentSeason() ? (this.#matchday()?.season.ended ?? false) : true,
  );
  public seasonStarted = linkedSignal(() =>
    this.#isCurrentSeason() ? (this.#matchday()?.season.started ?? true) : true,
  );
  public readonly team$ = toObservable(this.#team).pipe(
    distinctUntilChanged((prev, cur) => prev?.id === cur?.id),
  );
  public readonly requireTeam$ = this.team$.pipe(filterNil());
  public readonly matchday$ = toObservable(this.#matchday).pipe(
    filterNil(),
    distinctUntilChanged((prev, cur) => prev.id === cur.id),
  );

  public bootstrap(): Observable<unknown> {
    const bootstrap$: Array<Observable<unknown>> = [this.loadCurrentMatchday()];
    if (this.#authService.isLoggedIn()) {
      bootstrap$.push(this.#authService.getCurrentUser());
    }

    return forkJoin(bootstrap$).pipe(
      catchError((e: unknown) => {
        this.#writeError(e as Error);
        throw e;
      }),
    );
  }

  public loadCurrentMatchday(): Observable<Matchday> {
    return this.#matchdayService.getCurrentMatchday().pipe(
      tap((m) => {
        this.#matchday.set(m);
      }),
    );
  }

  public connect(): Subscription {
    const subscriptions = new Subscription();
    subscriptions.add(this.#refreshMatchday(inject(ApplicationRef)));
    subscriptions.add(this.#refreshUser());

    return subscriptions;
  }

  public async changeTeam(team: Team): Promise<Team | undefined> {
    const res = await firstValueFrom(this.#teamService.getTeam(team.id), {
      defaultValue: undefined,
    });
    this.#team.set(res);

    return res;
  }

  #refreshUser(): Subscription {
    return this.#authService.user$
      .pipe(tap((u) => this.#team.set(u?.teams?.length ? u.teams[0] : undefined)))
      .subscribe();
  }

  #refreshMatchday(appRef: ApplicationRef): Subscription {
    return appRef.isStable
      .pipe(
        filter((isStable) => isStable),
        first((stable) => stable),
        switchMap(() => interval(5 * 60 * 1000)),
        switchMap(() => this.loadCurrentMatchday()),
        share(),
        tap((matchday) => this.#matchday.set(matchday)),
      )
      .subscribe();
  }

  #writeError(e: Error): void {
    const el = this.#document.querySelector('#error');
    if (el !== null) {
      el.innerHTML =
        '<h3 class="error">Si è verificato un errore nel caricamento dell\'app. Ricarica la pagina per riprovare</h3>';
    }
    throw e;
  }
}

export const appInitializerProvider = provideAppInitializer(() =>
  inject(ApplicationService).bootstrap(),
);
