import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthenticationService } from '@app/authentication';
import { Matchday, Team } from '@data/types';
import { MatchdayService } from '@data/services';
import { environment } from '@env';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  public seasonEnded: boolean;
  public seasonStarted: boolean;
  public selectedMatchday: Matchday;
  // public championship?: Championship;
  public team$ = new BehaviorSubject<Team | undefined>(undefined);
  public teamChange$: Observable<Team | undefined>;
  private currentMatchday?: Matchday;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly authService: AuthenticationService,
    private readonly matchdayService: MatchdayService,
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.iconRegistry.addSvgIconSet(
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/fantamanajer-icons.svg'),
    );
    this.teamChange$ = this.team$.asObservable().pipe(distinctUntilChanged());
    void this.teamChange$.pipe(tap((t) => this.setTeam(t))).subscribe();
    void this.authService.userChange$
      .pipe(
        map((u) => u?.teams),
        tap((teams) => this.team$.next(teams?.length ? teams[0] : undefined)),
      )
      .subscribe();
  }

  get matchday(): Matchday {
    return this.selectedMatchday;
  }

  set matchday(matchday: Matchday) {
    this.selectedMatchday = matchday;
    this.recalcSeason(matchday);
  }

  public initialize(): Observable<unknown> {
    const obs: Array<Observable<unknown>> = [];
    obs.push(this.loadCurrentMatchday());
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

  private recalcSeason(matchday: Matchday): void {
    this.seasonEnded = matchday.number > environment.matchdaysCount;
    this.seasonStarted = matchday.number >= 0;
  }

  private writeError(e: Error): void {
    const el = this.document.querySelector('#error');
    if (el !== null) {
      el.innerHTML =
        '<h3 class="error">Si è verificato un errore nel caricamento dell\'app. Ricarica la pagina per riprovare</h3>';
    }
    throw e;
  }

  private loadCurrentMatchday(): Observable<Matchday> {
    return this.matchdayService.getCurrentMatchday().pipe(
      tap((m) => {
        this.currentMatchday = m;
        this.matchday = m;
      }),
    );
  }

  private setTeam(team?: Team): void {
    if (team) {
      if (team.championship.season_id !== this.matchday.season_id) {
        this.seasonStarted = false;
        this.seasonEnded = true;
      } else {
        this.recalcSeason(this.matchday);
      }
    } else if (this.currentMatchday) {
      this.matchday = this.currentMatchday;
    }
  }
}
