import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  APP_INITIALIZER,
  Inject,
  Injectable,
  Provider,
  inject,
} from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subject, Subscription, interval } from 'rxjs';
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
import { MatchdayService } from '@data/services';
import { Matchday, Team } from '@data/types';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  public seasonEnded = false;
  public seasonStarted = true;
  public readonly teamSubject$: BehaviorSubject<Team | undefined>;
  public readonly team$: Observable<Team | undefined>;
  public readonly requireTeam$: Observable<Team>;
  public readonly matchday$: Observable<Matchday>;
  private readonly matchdaySubject$: Subject<Matchday | undefined>;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly authService: AuthenticationService,
    private readonly matchdayService: MatchdayService,
  ) {
    this.teamSubject$ = new BehaviorSubject<Team | undefined>(undefined);
    this.team$ = this.teamSubject$.pipe(distinctUntilChanged());
    this.requireTeam$ = this.team$.pipe(filterNil());
    this.matchdaySubject$ = new BehaviorSubject<Matchday | undefined>(undefined);
    this.matchday$ = this.matchdaySubject$.pipe(filterNil()); // .pipe(distinctUntilChanged());
  }

  public bootstrap(): Observable<unknown> {
    const bootstrap$: Array<Observable<unknown>> = [this.loadCurrentMatchday()];
    if (this.authService.loggedIn()) {
      bootstrap$.push(this.authService.getCurrentUser());
    }

    return forkJoin(bootstrap$).pipe(
      catchError((e: unknown) => {
        this.writeError(e as Error);
        throw e;
      }),
    );
  }

  public loadCurrentMatchday(): Observable<Matchday> {
    return this.matchdayService.getCurrentMatchday().pipe(
      tap((m) => {
        this.recalcSeason(m);
        this.matchdaySubject$.next(m);
      }),
    );
  }

  public connect(): Subscription {
    const subscriptions = new Subscription();
    subscriptions.add(this.refreshMatchday(inject(ApplicationRef)));
    subscriptions.add(this.refreshUser());
    subscriptions.add(this.refreshTeam());

    return subscriptions;
  }

  private refreshUser(): Subscription {
    return this.authService.user$
      .pipe(tap((u) => this.teamSubject$.next(u?.teams?.length ? u.teams[0] : undefined)))
      .subscribe();
  }

  private refreshTeam(): Subscription {
    return forkJoin([this.team$, this.matchday$])
      .pipe(tap(([teamSubject, matchday]) => this.setTeam(matchday, teamSubject)))
      .subscribe();
  }

  private refreshMatchday(appRef: ApplicationRef): Subscription {
    return appRef.isStable
      .pipe(
        filter((isStable) => isStable),
        first((stable) => stable),
        switchMap(() => interval(5 * 60 * 1000)),
        switchMap(() => this.loadCurrentMatchday()),
        share(),
      )
      .subscribe(this.matchdaySubject$);
  }

  private recalcSeason(matchday: Matchday): void {
    this.seasonStarted = matchday.season.started;
    this.seasonEnded = matchday.season.ended;
  }

  private writeError(e: Error): void {
    const el = this.document.querySelector('#error');
    if (el !== null) {
      el.innerHTML =
        '<h3 class="error">Si è verificato un errore nel caricamento dell\'app. Ricarica la pagina per riprovare</h3>';
    }
    throw e;
  }

  private setTeam(matchday: Matchday, teamSubject?: Team): void {
    if (teamSubject?.championship.season_id !== matchday.season_id) {
      this.seasonStarted = false;
      this.seasonEnded = true;
    } else {
      this.recalcSeason(matchday);
    }
  }
}

export const appInitializerProvider: Provider = {
  deps: [ApplicationService, TokenStorageService],
  multi: true,
  provide: APP_INITIALIZER,
  useFactory: (app: ApplicationService) => (): Observable<unknown> => app.bootstrap(),
};
