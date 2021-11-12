import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, interval, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, share, switchMap, tap } from 'rxjs/operators';

import { AuthenticationService } from '@app/authentication';
import { Matchday, Team } from '@data/types';
import { MatchdayService } from '@data/services';

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
    this.requireTeam$ = this.team$.pipe(filter((t): t is Team => t !== undefined));
    this.matchdaySubject$ = new BehaviorSubject<Matchday | undefined>(undefined);
    this.matchday$ = this.matchdaySubject$.pipe(filter((m): m is Matchday => m !== undefined)); //.pipe(distinctUntilChanged());
  }

  public bootstrap(): Observable<unknown> {
    const obs: Array<Observable<unknown>> = [this.loadCurrentMatchday()];
    if (this.authService.loggedIn()) {
      obs.push(this.authService.getCurrentUser());
    }

    return forkJoin(obs).pipe(
      catchError((e: unknown) => {
        this.writeError(e as Error);

        return of();
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

  public initialize(): void {
    void forkJoin([this.team$, this.matchday$])
      .pipe(tap(([teamSubject, matchday]) => this.setTeam(matchday, teamSubject)))
      .subscribe();
    void this.authService.user$
      .pipe(tap((u) => this.teamSubject$.next(u?.teams?.length ? u?.teams[0] : undefined)))
      .subscribe();
    void interval(5 * 60 * 1000)
      .pipe(
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
