import { DOCUMENT } from '@angular/common';
import { ApplicationRef, APP_INITIALIZER, Injectable, Provider, inject } from '@angular/core';
import {
  BehaviorSubject,
  forkJoin,
  Observable,
  Subscription,
  interval,
  firstValueFrom,
  combineLatest,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  tap,
  first,
  switchMap,
  share,
} from 'rxjs/operators';

import { AuthenticationService, TokenStorageService } from '@app/authentication';
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
  readonly #matchdaySubject$ = new BehaviorSubject<Matchday | undefined>(undefined);
  readonly #teamSubject$ = new BehaviorSubject<Team | undefined>(undefined);

  public seasonEnded = false;
  public seasonStarted = true;
  public readonly team$ = this.#teamSubject$.pipe(distinctUntilChanged());
  public readonly requireTeam$ = this.team$.pipe(filterNil());
  public readonly matchday$ = this.#matchdaySubject$.pipe(
    filterNil(),
    distinctUntilChanged((prev, cur) => prev.id === cur.id),
  );

  public bootstrap(): Observable<unknown> {
    const bootstrap$: Array<Observable<unknown>> = [this.loadCurrentMatchday()];
    if (this.#authService.loggedIn()) {
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
        this.#recalcSeason(m);
        this.#matchdaySubject$.next(m);
      }),
    );
  }

  public connect(): Subscription {
    const subscriptions = new Subscription();
    subscriptions.add(this.#refreshMatchday(inject(ApplicationRef)));
    subscriptions.add(this.#refreshUser());
    subscriptions.add(this.#refreshTeam());

    return subscriptions;
  }

  public async changeTeam(team: Team): Promise<Team> {
    const res = await firstValueFrom(this.#teamService.getTeam(team.id));
    this.#teamSubject$.next(res);

    return res;
  }

  #refreshUser(): Subscription {
    return this.#authService.user$
      .pipe(tap((u) => this.#teamSubject$.next(u?.teams?.length ? u.teams[0] : undefined)))
      .subscribe();
  }

  #refreshTeam(): Subscription {
    return combineLatest([this.team$, this.matchday$])
      .pipe(tap(([teamSubject, matchday]) => this.#setTeam(matchday, teamSubject)))
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
      )
      .subscribe(this.#matchdaySubject$);
  }

  #recalcSeason(matchday: Matchday): void {
    this.seasonStarted = matchday.season.started;
    this.seasonEnded = matchday.season.ended;
  }

  #writeError(e: Error): void {
    const el = this.#document.querySelector('#error');
    if (el !== null) {
      el.innerHTML =
        '<h3 class="error">Si è verificato un errore nel caricamento dell\'app. Ricarica la pagina per riprovare</h3>';
    }
    throw e;
  }

  #setTeam(matchday: Matchday, teamSubject?: Team): void {
    if (teamSubject?.championship.season_id === matchday.season_id) {
      this.#recalcSeason(matchday);
    } else {
      this.seasonStarted = false;
      this.seasonEnded = true;
    }
  }
}

export const appInitializerProvider: Provider = {
  deps: [ApplicationService, TokenStorageService],
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: (app: ApplicationService) => (): Observable<unknown> => app.bootstrap(),
};
